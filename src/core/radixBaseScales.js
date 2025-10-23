/**
 * Base color scales from Radix UI Colors
 * These are reference scales used to find the closest match to a user's color
 *
 * Data extracted from @radix-ui/colors P3 color spaces
 */

import Color from 'colorjs.io';

// Helper to parse P3 color strings to Color objects in OKLCH
function parseP3ToOklch(p3String) {
  return new Color(p3String).to('oklch');
}

// Light theme base scales
const lightScalesP3 = {
  gray: [
    "color(display-p3 0.988 0.988 0.988)",
    "color(display-p3 0.975 0.975 0.975)",
    "color(display-p3 0.939 0.939 0.939)",
    "color(display-p3 0.908 0.908 0.908)",
    "color(display-p3 0.88 0.88 0.88)",
    "color(display-p3 0.849 0.849 0.849)",
    "color(display-p3 0.807 0.807 0.807)",
    "color(display-p3 0.732 0.732 0.732)",
    "color(display-p3 0.553 0.553 0.553)",
    "color(display-p3 0.512 0.512 0.512)",
    "color(display-p3 0.392 0.392 0.392)",
    "color(display-p3 0.125 0.125 0.125)"
  ],
  slate: [
    "color(display-p3 0.988 0.988 0.992)",
    "color(display-p3 0.976 0.976 0.984)",
    "color(display-p3 0.94 0.941 0.953)",
    "color(display-p3 0.908 0.909 0.925)",
    "color(display-p3 0.88 0.881 0.901)",
    "color(display-p3 0.85 0.852 0.876)",
    "color(display-p3 0.805 0.808 0.838)",
    "color(display-p3 0.727 0.733 0.773)",
    "color(display-p3 0.547 0.553 0.592)",
    "color(display-p3 0.503 0.512 0.549)",
    "color(display-p3 0.379 0.392 0.421)",
    "color(display-p3 0.113 0.125 0.14)"
  ],
  red: [
    "color(display-p3 0.998 0.989 0.988)",
    "color(display-p3 0.995 0.971 0.971)",
    "color(display-p3 0.985 0.925 0.925)",
    "color(display-p3 0.999 0.866 0.866)",
    "color(display-p3 0.984 0.812 0.811)",
    "color(display-p3 0.955 0.751 0.749)",
    "color(display-p3 0.915 0.675 0.672)",
    "color(display-p3 0.872 0.575 0.572)",
    "color(display-p3 0.83 0.329 0.324)",
    "color(display-p3 0.798 0.294 0.285)",
    "color(display-p3 0.744 0.234 0.222)",
    "color(display-p3 0.36 0.115 0.143)"
  ],
  blue: [
    "color(display-p3 0.986 0.992 0.999)",
    "color(display-p3 0.96 0.979 0.998)",
    "color(display-p3 0.912 0.956 0.991)",
    "color(display-p3 0.853 0.932 1)",
    "color(display-p3 0.788 0.894 0.998)",
    "color(display-p3 0.709 0.843 0.976)",
    "color(display-p3 0.606 0.777 0.947)",
    "color(display-p3 0.451 0.688 0.917)",
    "color(display-p3 0.247 0.556 0.969)",
    "color(display-p3 0.234 0.523 0.912)",
    "color(display-p3 0.15 0.44 0.84)",
    "color(display-p3 0.102 0.193 0.379)"
  ],
  green: [
    "color(display-p3 0.986 0.996 0.989)",
    "color(display-p3 0.963 0.983 0.967)",
    "color(display-p3 0.913 0.964 0.925)",
    "color(display-p3 0.859 0.94 0.879)",
    "color(display-p3 0.796 0.907 0.826)",
    "color(display-p3 0.718 0.863 0.761)",
    "color(display-p3 0.61 0.801 0.675)",
    "color(display-p3 0.451 0.715 0.559)",
    "color(display-p3 0.332 0.634 0.442)",
    "color(display-p3 0.308 0.595 0.417)",
    "color(display-p3 0.19 0.5 0.32)",
    "color(display-p3 0.132 0.228 0.18)"
  ],
  orange: [
    "color(display-p3 0.995 0.991 0.987)",
    "color(display-p3 0.992 0.975 0.964)",
    "color(display-p3 0.995 0.934 0.895)",
    "color(display-p3 1 0.888 0.824)",
    "color(display-p3 0.999 0.842 0.755)",
    "color(display-p3 0.983 0.793 0.686)",
    "color(display-p3 0.955 0.732 0.607)",
    "color(display-p3 0.917 0.651 0.503)",
    "color(display-p3 0.903 0.514 0.29)",
    "color(display-p3 0.877 0.474 0.264)",
    "color(display-p3 0.743 0.346 0.178)",
    "color(display-p3 0.387 0.208 0.131)"
  ],
  yellow: [
    "color(display-p3 0.995 0.993 0.98)",
    "color(display-p3 0.998 0.988 0.93)",
    "color(display-p3 0.996 0.962 0.81)",
    "color(display-p3 1 0.944 0.694)",
    "color(display-p3 0.992 0.92 0.609)",
    "color(display-p3 0.976 0.887 0.538)",
    "color(display-p3 0.948 0.836 0.462)",
    "color(display-p3 0.907 0.759 0.369)",
    "color(display-p3 0.998 0.782 0)",
    "color(display-p3 0.947 0.718 0.037)",
    "color(display-p3 0.708 0.494 0.001)",
    "color(display-p3 0.377 0.284 0.13)"
  ],
  purple: [
    "color(display-p3 0.994 0.991 0.998)",
    "color(display-p3 0.984 0.978 0.995)",
    "color(display-p3 0.962 0.948 0.995)",
    "color(display-p3 0.935 0.916 0.995)",
    "color(display-p3 0.901 0.879 0.984)",
    "color(display-p3 0.857 0.832 0.963)",
    "color(display-p3 0.798 0.768 0.929)",
    "color(display-p3 0.717 0.682 0.883)",
    "color(display-p3 0.618 0.561 0.865)",
    "color(display-p3 0.583 0.522 0.834)",
    "color(display-p3 0.524 0.456 0.763)",
    "color(display-p3 0.282 0.214 0.464)"
  ]
};

// Dark theme base scales
const darkScalesP3 = {
  gray: [
    "color(display-p3 0.068 0.068 0.068)",
    "color(display-p3 0.083 0.083 0.083)",
    "color(display-p3 0.115 0.115 0.115)",
    "color(display-p3 0.141 0.141 0.141)",
    "color(display-p3 0.165 0.165 0.165)",
    "color(display-p3 0.191 0.191 0.191)",
    "color(display-p3 0.226 0.226 0.226)",
    "color(display-p3 0.285 0.285 0.285)",
    "color(display-p3 0.414 0.414 0.414)",
    "color(display-p3 0.46 0.46 0.46)",
    "color(display-p3 0.634 0.634 0.634)",
    "color(display-p3 0.927 0.927 0.927)"
  ],
  slate: [
    "color(display-p3 0.067 0.07 0.075)",
    "color(display-p3 0.082 0.086 0.094)",
    "color(display-p3 0.113 0.119 0.134)",
    "color(display-p3 0.139 0.145 0.165)",
    "color(display-p3 0.163 0.17 0.194)",
    "color(display-p3 0.189 0.198 0.226)",
    "color(display-p3 0.224 0.236 0.271)",
    "color(display-p3 0.282 0.299 0.347)",
    "color(display-p3 0.412 0.433 0.486)",
    "color(display-p3 0.458 0.481 0.536)",
    "color(display-p3 0.632 0.655 0.704)",
    "color(display-p3 0.927 0.935 0.947)"
  ],
  red: [
    "color(display-p3 0.086 0.061 0.064)",
    "color(display-p3 0.101 0.066 0.071)",
    "color(display-p3 0.143 0.076 0.086)",
    "color(display-p3 0.178 0.082 0.096)",
    "color(display-p3 0.206 0.093 0.109)",
    "color(display-p3 0.238 0.111 0.128)",
    "color(display-p3 0.281 0.143 0.161)",
    "color(display-p3 0.347 0.197 0.217)",
    "color(display-p3 0.83 0.329 0.324)",
    "color(display-p3 0.856 0.402 0.393)",
    "color(display-p3 0.95 0.584 0.567)",
    "color(display-p3 0.988 0.826 0.819)"
  ],
  blue: [
    "color(display-p3 0.055 0.082 0.125)",
    "color(display-p3 0.067 0.098 0.153)",
    "color(display-p3 0.068 0.152 0.267)",
    "color(display-p3 0.053 0.193 0.369)",
    "color(display-p3 0.066 0.237 0.439)",
    "color(display-p3 0.105 0.285 0.504)",
    "color(display-p3 0.163 0.344 0.587)",
    "color(display-p3 0.205 0.415 0.702)",
    "color(display-p3 0.247 0.556 0.969)",
    "color(display-p3 0.3 0.601 0.983)",
    "color(display-p3 0.503 0.713 0.996)",
    "color(display-p3 0.792 0.891 1)"
  ],
  green: [
    "color(display-p3 0.055 0.077 0.062)",
    "color(display-p3 0.063 0.092 0.074)",
    "color(display-p3 0.072 0.135 0.098)",
    "color(display-p3 0.074 0.172 0.118)",
    "color(display-p3 0.085 0.206 0.143)",
    "color(display-p3 0.109 0.245 0.173)",
    "color(display-p3 0.149 0.296 0.215)",
    "color(display-p3 0.208 0.366 0.276)",
    "color(display-p3 0.332 0.634 0.442)",
    "color(display-p3 0.397 0.677 0.499)",
    "color(display-p3 0.547 0.781 0.634)",
    "color(display-p3 0.797 0.918 0.851)"
  ],
  orange: [
    "color(display-p3 0.084 0.069 0.059)",
    "color(display-p3 0.099 0.079 0.065)",
    "color(display-p3 0.139 0.099 0.073)",
    "color(display-p3 0.175 0.115 0.077)",
    "color(display-p3 0.207 0.134 0.085)",
    "color(display-p3 0.243 0.158 0.099)",
    "color(display-p3 0.293 0.192 0.124)",
    "color(display-p3 0.372 0.248 0.167)",
    "color(display-p3 0.903 0.514 0.29)",
    "color(display-p3 0.949 0.591 0.352)",
    "color(display-p3 0.997 0.746 0.572)",
    "color(display-p3 0.998 0.909 0.822)"
  ],
  yellow: [
    "color(display-p3 0.081 0.077 0.049)",
    "color(display-p3 0.096 0.089 0.055)",
    "color(display-p3 0.132 0.116 0.055)",
    "color(display-p3 0.165 0.141 0.051)",
    "color(display-p3 0.196 0.167 0.053)",
    "color(display-p3 0.232 0.197 0.061)",
    "color(display-p3 0.283 0.237 0.078)",
    "color(display-p3 0.367 0.303 0.112)",
    "color(display-p3 0.998 0.782 0)",
    "color(display-p3 1 0.821 0.126)",
    "color(display-p3 0.996 0.895 0.566)",
    "color(display-p3 0.996 0.962 0.81)"
  ],
  purple: [
    "color(display-p3 0.083 0.071 0.095)",
    "color(display-p3 0.095 0.08 0.113)",
    "color(display-p3 0.123 0.095 0.164)",
    "color(display-p3 0.147 0.106 0.208)",
    "color(display-p3 0.172 0.123 0.251)",
    "color(display-p3 0.203 0.148 0.299)",
    "color(display-p3 0.249 0.189 0.365)",
    "color(display-p3 0.32 0.254 0.463)",
    "color(display-p3 0.618 0.561 0.865)",
    "color(display-p3 0.666 0.609 0.897)",
    "color(display-p3 0.78 0.73 0.967)",
    "color(display-p3 0.933 0.916 0.996)"
  ]
};

// Convert all scales to OKLCH
function convertScalesToOklch(scalesP3) {
  const result = {};
  for (const [name, scale] of Object.entries(scalesP3)) {
    result[name] = scale.map(parseP3ToOklch);
  }
  return result;
}

export const lightColors = convertScalesToOklch(lightScalesP3);
export const darkColors = convertScalesToOklch(darkScalesP3);
export const lightGrayColors = convertScalesToOklch({
  gray: lightScalesP3.gray,
  slate: lightScalesP3.slate
});
export const darkGrayColors = convertScalesToOklch({
  gray: darkScalesP3.gray,
  slate: darkScalesP3.slate
});

/**
 * Returns base color scales for the given appearance
 */
export function getRadixBaseColors(appearance) {
  return {
    allScales: appearance === 'light' ? lightColors : darkColors,
    grayScales: appearance === 'light' ? lightGrayColors : darkGrayColors
  };
}
