export default function (timestamp) {
  var datetime = new Date(timestamp * 1000);
  //var dataValues = datetime.toISOString().split('T');
  var year = datetime.getFullYear();
  var month = datetime.getMonth() + 1;
  var date = datetime.getDate();
  var hour = datetime.getHours();
  var minute = datetime.getMinutes();
  var second = datetime.getSeconds();

  return year + "-" + month + "-" + date+" "+hour+":"+minute+":"+second;
}
