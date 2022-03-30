import type { PosType } from "../interfaces";

const MOVE_UNITS = 10;

export const calcChangeInPosVec = (
  yRot: number,
  zRot: number,
  _moveUnits = MOVE_UNITS,
  extra = 0
): PosType => {
  const deltaX = Math.sin(zRot) * _moveUnits * Math.cos(yRot) * Math.cos(extra);
  const deltaY = Math.cos(zRot) * _moveUnits * Math.cos(yRot) * Math.cos(extra);
  const deltaZ = Math.sin(yRot) * _moveUnits;
  return [deltaX, deltaY, deltaZ];
};
