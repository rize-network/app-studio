export type Shadow = {
  shadowColor: string;
  shadowOffset: {
    width: number;
    height: number;
  };
  shadowOpacity: number;
  shadowRadius: number;
};

export const Shadows: Record<number, Shadow> = {
  0: {
    shadowColor: '#000',
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
  },
  1: {
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  2: {
    shadowColor: '#000',
    shadowOffset: {
      width: 3,
      height: 3,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  3: {
    shadowColor: '#000',
    shadowOffset: {
      width: 4,
      height: 4,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
  },
  4: {
    shadowColor: '#000',
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  5: {
    shadowColor: '#000',
    shadowOffset: {
      width: 6,
      height: 6,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
  },
  6: {
    shadowColor: '#000',
    shadowOffset: {
      width: 7,
      height: 7,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
  },
  7: {
    shadowColor: '#000',
    shadowOffset: {
      width: 8,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  8: {
    shadowColor: '#000',
    shadowOffset: {
      width: 9,
      height: 9,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
  },
  9: {
    shadowColor: '#000',
    shadowOffset: {
      width: 10,
      height: 10,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
  },
};
