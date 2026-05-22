$("#form-submit").click(function(){
  this.textContent= this.textContent + "中...";
  var rand = Math.random() * 1000 + 500;
  setTimeout(function(){
    location.href= HotelConfig.root + "/room/index.html";
  },rand);
  return false;
});