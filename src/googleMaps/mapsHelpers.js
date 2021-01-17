'use strict';
const { SphericalUtil } = require('node-geometry-library');

const MapsHelpers = {
  findMidpt(ptsArr) {
    let midpt = SphericalUtil.computeLength(ptsArr) / 2;
    let sum = 0;
    let centerCoordinates;
    for (let i = 0; i < ptsArr.length; i++) {
      let target = midpt;
      let curr = 0;

      curr = SphericalUtil.computeDistanceBetween(
        ptsArr[i],
        ptsArr[i + 1]
      );

      sum += curr;
      if (sum > target) {
        sum -= curr;
        let heading = SphericalUtil.computeHeading(
          ptsArr[i],
          ptsArr[i + 1]
        );
        centerCoordinates = SphericalUtil.computeOffset(
          ptsArr[i],
          target - sum,
          heading
        );
        return centerCoordinates;
      }
    }
  },
};

module.exports = MapsHelpers;