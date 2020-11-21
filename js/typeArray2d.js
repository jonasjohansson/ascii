typeArray2d = function (_arr2d, _dst, _x, _y, _w, _h) {
  if (_arr2d === null) {
    console.log("[typeArray2d] _arr2d === null");
    return;
  }
  if (_arr2d === undefined) {
    console.log("[typeArray2d] _arr2d === undefined");
    return;
  }
  switch (arguments.length) {
    case 2:
      _x = 0;
      _y = 0;
      _w = width;
      _h = height;
      break;
    case 4:
      _w = width;
      _h = height;
      break;
    case 6:
      /* nothing to do */ break;
    default:
      console.log("[typeArray2d] bad number of arguments: " + arguments.length);
      return;
  }

  if (_dst.canvas === null) {
    console.log("[typeArray2d] _dst.canvas === null");
    return;
  }
  if (_dst.canvas === undefined) {
    console.log("[typeArray2d] _dst.canvas === undefined");
    return;
  }
  var temp_ctx2d = _dst.canvas.getContext("2d");
  if (temp_ctx2d === null) {
    console.log("[typeArray2d] _dst canvas 2d context is null");
    return;
  }
  if (temp_ctx2d === undefined) {
    console.log("[typeArray2d] _dst canvas 2d context is undefined");
    return;
  }
  var dist_hor = _w / _arr2d.length;
  var dist_ver = _h / _arr2d[0].length;
  var offset_x = _x + dist_hor * 0.5;
  var offset_y = _y + dist_ver * 0.5;
  for (var temp_y = 0; temp_y < _arr2d[0].length; temp_y++)
    for (var temp_x = 0; temp_x < _arr2d.length; temp_x++)
      /*text*/ temp_ctx2d.fillText(
        _arr2d[temp_x][temp_y],
        offset_x + temp_x * dist_hor,
        offset_y + temp_y * dist_ver
      );
};
