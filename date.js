//console.log(module);

// module.exports = "hello world";
exports.getDate = function (){
  const today = new Date();
  const options = {
    month: "long",
    day: "numeric",
    weekday: "long"
  }
  return today.toLocaleDateString("en-US", options);
}

exports.getDay = function (){
  const today = new Date();
  const options = {
    weekday: "long"
  }
  return today.toLocaleDateString("en-US", options);
}

//console.log(module.exports);
