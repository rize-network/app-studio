/**
 * useUpload — cross-platform file upload with progress, loading & error state.
 *
 * A dependency-free port of the original app-demo `useUploadRequest`, which
 * imported a project-specific `upload()` util. Here the transport is pluggable
 * and defaults to an `XMLHttpRequest` (available on both web and React Native)
 * so progress works out of the box without any native module. Pairs with the
 * `Uploader` / `FormikUploader` components.
 */
import { useCallback, useMemo, useRef, useState } from 'react';

/**
 * A file to upload. On web pass a `File`/`Blob`. On native pass an object with
 * `{ uri, name, type }` (the shape RN's FormData understands). Extra fields are
 * forwarded to the transport for custom implementations.
 */
export type UploadFile =
  | File
  | Blob
  | {
      uri: string;
      name?: string;
      type?: string;
      [key: string]: any;
    };

export interface UploadTransportConfig {
  url: string;
  method: string;
  headers: Record<string, string>;
  fieldName: string;
  withCredentials: boolean;
  file: UploadFile;
  // Extra form fields sent alongside the file.
  data?: Record<string, any>;
  onProgress: (percent: number) => void;
}

export interface UploadHandle {
  // Abort the in-flight request, if the transport supports it.
  abort: () => void;
  // Resolves with the parsed response body on success, rejects on failure.
  done: Promise<any>;
}

export type UploadTransport = (config: UploadTransportConfig) => UploadHandle;

export interface UseUploadOptions {
  url: string;
  method?: 'POST' | 'PUT' | 'PATCH';
  headers?: Record<string, string>;
  // Multipart field name for the file. Default 'file'.
  fieldName?: string;
  withCredentials?: boolean;
  // Debounce rapid `run` calls (original used 1000ms). Default 0.
  debounceMs?: number;
  // Swap the default XHR transport (e.g. fetch, axios, signed S3 PUT).
  transport?: UploadTransport;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
  onProgress?: (percent: number) => void;
}

export interface UseUploadResult<T = any> {
  // Start an upload. Optional `data` adds extra multipart fields.
  run: (file: UploadFile, data?: Record<string, any>) => void;
  // Abort the current upload.
  abort: () => void;
  // Reset state back to idle.
  reset: () => void;
  data: T | undefined;
  file: UploadFile | undefined;
  progress: number;
  loading: boolean;
  error: Error | undefined;
}

const parseBody = (xhr: XMLHttpRequest): any => {
  const text = xhr.responseText;
  if (!text) return undefined;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

/**
 * Default transport: a multipart `XMLHttpRequest` with real upload-progress
 * events. Works identically on web (File/Blob) and React Native (uri object).
 */
export const xhrUploadTransport: UploadTransport = ({
  url,
  method,
  headers,
  fieldName,
  withCredentials,
  file,
  data,
  onProgress,
}) => {
  const xhr = new XMLHttpRequest();
  const form = new FormData();
  form.append(fieldName, file as any);
  if (data) {
    Object.keys(data).forEach((key) => form.append(key, data[key] as any));
  }

  const done = new Promise<any>((resolve, reject) => {
    xhr.open(method, url);
    xhr.withCredentials = withCredentials;
    Object.keys(headers).forEach((key) =>
      xhr.setRequestHeader(key, headers[key])
    );
    if (xhr.upload) {
      xhr.upload.onprogress = (event: ProgressEvent) => {
        if (event.lengthComputable) {
          onProgress(Math.round((event.loaded / event.total) * 100));
        }
      };
    }
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        onProgress(100);
        resolve(parseBody(xhr));
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`));
      }
    };
    xhr.onerror = () => reject(new Error('Network error during upload'));
    xhr.onabort = () => reject(new Error('Upload aborted'));
    xhr.send(form);
  });

  return { abort: () => xhr.abort(), done };
};

export const useUpload = <T = any>(
  options: UseUploadOptions
): UseUploadResult<T> => {
  const { debounceMs = 0 } = options;

  const [data, setData] = useState<T | undefined>(undefined);
  const [file, setFile] = useState<UploadFile | undefined>(undefined);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | undefined>(undefined);

  // Keep the latest options/callbacks in a ref so the debounced `run` stays
  // stable without going stale.
  const handleRef = useRef<UploadHandle | null>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const optsRef = useRef(options);
  optsRef.current = options;

  const start = useCallback(
    (uploadFile: UploadFile, extra?: Record<string, any>) => {
      setLoading(true);
      setProgress(0);
      setError(undefined);
      setFile(uploadFile);

      const {
        url,
        method = 'POST',
        headers = {},
        fieldName = 'file',
        withCredentials = false,
        transport = xhrUploadTransport,
      } = optsRef.current;

      const handle = transport({
        url,
        method,
        headers,
        fieldName,
        withCredentials,
        file: uploadFile,
        data: extra,
        onProgress: (percent) => {
          setProgress(percent);
          optsRef.current.onProgress?.(percent);
        },
      });
      handleRef.current = handle;

      handle.done
        .then((result) => {
          setLoading(false);
          setData(result);
          optsRef.current.onSuccess?.(result);
        })
        .catch((err: Error) => {
          setLoading(false);
          setError(err);
          optsRef.current.onError?.(err);
        });
    },
    // Everything is read from optsRef at call time, so `start` never changes
    // identity and never goes stale.
    []
  );

  const run = useCallback(
    (uploadFile: UploadFile, extra?: Record<string, any>) => {
      if (debounceMs > 0) {
        if (debounceTimer.current) clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(
          () => start(uploadFile, extra),
          debounceMs
        );
      } else {
        start(uploadFile, extra);
      }
    },
    [debounceMs, start]
  );

  const abort = useCallback(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    handleRef.current?.abort();
  }, []);

  const reset = useCallback(() => {
    abort();
    setData(undefined);
    setFile(undefined);
    setProgress(0);
    setLoading(false);
    setError(undefined);
  }, [abort]);

  return useMemo(
    () => ({ run, abort, reset, data, file, progress, loading, error }),
    [run, abort, reset, data, file, progress, loading, error]
  );
};

// `url`/`headers`/`onSuccess`/`onError`/`onProgress` are intentionally not
// start() deps — they are read through optsRef.current at call time, so caller
// identity changes (e.g. an inline `headers` object) don't recreate `run`.
