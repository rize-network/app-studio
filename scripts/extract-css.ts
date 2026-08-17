
import * as fs from 'fs';
import * as path from 'path';
import * as glob from 'glob';
import * as ts from 'typescript';

// Configuration
const SOURCE_PATTERN = 'src/**/*.tsx';
const OUTPUT_CSS_FILE = 'dist/static.css';

// CSS Extraction Logic
const staticStyles = new Map<string, string>(); // className -> cssContent

function extractStaticStyles(fileName: string) {
    const content = fs.readFileSync(fileName, 'utf-8');
    const sourceFile = ts.createSourceFile(
        fileName,
        content,
        ts.ScriptTarget.Latest,
        true
    );

    function visit(node: ts.Node) {
        if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
            const tagName = node.tagName.getText();
            
            // Only process our components (View, Text, etc.)
            // For PoC, we assume anything starting with Uppercase is potentially ours
            if (/^[A-Z]/.test(tagName)) {
                processAttributes(node.attributes);
            }
        }
        ts.forEachChild(node, visit);
    }

    function processAttributes(attributes: ts.JsxAttributes) {
        attributes.properties.forEach(prop => {
            if (ts.isJsxAttribute(prop)) {
                const name = prop.name.getText();
                const initializer = prop.initializer;

                // We only care about static values
                // e.g. padding={20} or padding="20px"
                // NOT padding={someVariable}
                
                if (initializer) {
                    let value: string | number | undefined;

                    if (ts.isStringLiteral(initializer)) {
                        value = initializer.text;
                    } else if (ts.isJsxExpression(initializer) && initializer.expression) {
                        if (ts.isNumericLiteral(initializer.expression)) {
                            value = parseFloat(initializer.expression.text);
                        } else if (ts.isStringLiteral(initializer.expression)) {
                            value = initializer.expression.text;
                        }
                    }

                    if (value !== undefined) {
                        // For PoC, we just log what we found
                        // In a real implementation, we would call the same logic as utilityClassManager
                        // to generate the CSS and class name.
                        // console.log(`Found static prop: ${tagName} ${name}=${value}`);
                        
                        // Check if it looks like a style prop 
                        // (Simple check for PoC: common style names)
                        if (['padding', 'margin', 'backgroundColor', 'color', 'width', 'height', 'fontSize'].includes(name)) {
                             // Simulate generating a class
                             const className = `static-${name}-${String(value).replace(/[^a-zA-Z0-9]/g, '-')}`;
                             const cssRule = `.${className} { ${toKebabCase(name)}: ${formatValue(name, value)}; }`;
                             
                             if (!staticStyles.has(className)) {
                                 staticStyles.set(className, cssRule);
                             }
                        }
                    }
                }
            }
        });
    }

    visit(sourceFile);
}

// Helpers (Mocking what we have in the real codebase)
function toKebabCase(str: string) {
    return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

function formatValue(prop: string, value: string | number) {
    if (typeof value === 'number' && ['padding', 'margin', 'width', 'height', 'fontSize'].includes(prop)) {
        return `${value}px`;
    }
    return value;
}

// Main Execution
const files = glob.sync(SOURCE_PATTERN);
console.log(`Scanning ${files.length} files...`);

files.forEach(file => {
    extractStaticStyles(file);
});

console.log(`Extracted ${staticStyles.size} static classes.`);

// Generate CSS
const cssContent = Array.from(staticStyles.values()).join('\n');
if (cssContent) {
    if (!fs.existsSync(path.dirname(OUTPUT_CSS_FILE))) {
        fs.mkdirSync(path.dirname(OUTPUT_CSS_FILE), { recursive: true });
    }
    fs.writeFileSync(OUTPUT_CSS_FILE, cssContent);
    console.log(`Written CSS to ${OUTPUT_CSS_FILE}`);
} else {
    console.log('No static styles found.');
}
