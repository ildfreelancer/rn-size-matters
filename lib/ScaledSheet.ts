import * as RN from "react-native";

import deepMap from "./deep-map";

// Groups                     Size                   Func Factor
//                             1                      2    3
const validScaleSheetRegex = /^(-?\d+(?:\.\d{1,3})?)@(mv?s(\d+(?:\.\d{1,2})?)?|s|vs)r?$/;

type Scale = `${number}@s${"r" | ""}`;
type VerticalScale = `${number}@vs${"r" | ""}`;
type ModerateScale = `${number}@ms${number | ""}${"r" | ""}`;
type ModerateVerticalScale = `${number}@mvs${number | ""}${"r" | ""}`;
type Size = Scale | VerticalScale | ModerateScale | ModerateVerticalScale;
type WithSize<T> = { [P in keyof T]: number extends T[P] ? Size | T[P] : T[P] };
type ViewStyle = WithSize<RN.ViewStyle>;
type TextStyle = WithSize<RN.TextStyle>;
type ImageStyle = WithSize<RN.ImageStyle>;
type NamedStyles<T> = { [P in keyof T]: ViewStyle | TextStyle | ImageStyle };

const scaleByAnnotation = (
  scale: (v: number) => number,
  verticalScale: (v: number) => number,
  moderateScale: (v: number, factor: number) => number,
  moderateVerticalScale: (v: number, factor: number) => number
) => {
  return (value: string) => {
    if (!validScaleSheetRegex.test(value)) {
      return value;
    }

    const regexExecResult = validScaleSheetRegex.exec(value);

    const size = regexExecResult ? parseFloat(regexExecResult[1]) : 0;
    let scaleFunc = regexExecResult?.[2];
    const scaleFactor = regexExecResult?.[3]; // string or undefined

    if (scaleFactor) {
      scaleFunc = scaleFunc?.slice(0, -scaleFactor.length);
    } // Remove the factor from it

    const shouldRound = value.endsWith("r");

    let result: number;

    switch (scaleFunc) {
      case "s":
        result = scale(size);
        break;
      case "vs":
        result = verticalScale(size);
        break;
      case "ms":
        result = moderateScale(
          size,
          typeof scaleFactor === "number" ? scaleFactor : parseFloat(scaleFactor)
        );
        break;
      case "mvs":
        result = moderateVerticalScale(
          size,
          typeof scaleFactor === "number" ? scaleFactor : parseFloat(scaleFactor)
        );
        break;
    }

    return shouldRound ? Math.round(result) : result;
  };
};

const scaledSheetCreator = (
  scale: (v: number) => number,
  verticalScale: (v: number) => number,
  moderateScale: (v: number, factor: number) => number,
  moderateVerticalScale: (v: number, factor: number) => number
) => {
  const scaleFunc = scaleByAnnotation(scale, verticalScale, moderateScale, moderateVerticalScale);
  const create = <T extends NamedStyles<T> | NamedStyles<any>>(stylesObject: T) =>
    RN.StyleSheet.create(deepMap(stylesObject, scaleFunc)) as {
      [P in keyof T]: RN.RegisteredStyle<{
        [S in keyof T[P]]: T[P][S] extends Size ? number : T[P][S];
      }>;
    };
  return { create };
};

export default scaledSheetCreator;
