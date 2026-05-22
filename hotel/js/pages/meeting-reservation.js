require.config(Hotel.requireConfig);

define(["ajaxSub","dropdownSelect","bsDialog"],function(ajaxSub,dropdownSelect,dialog){
  var carouselDate = $("#carousel-box"),
       nextBtn = $("#carouselNext"),
       prevBtn = $("#carouselPrev");

    dropdownSelect($("#search-bar"));

   //create  date-carousel start
   var range = [9,24],current = range[0],html ="";
   while(current < range[1]){
        html += '<span class="carousel-item">' + current + ":00-" + (++current) +":00" + "</span>";
    }
    carouselDate.children().first().html(html);
    //create over

    //create meeting-carousel
    var current2 = range[0],meetingHtml = "";
    while(current2 < range[1]){
            var random = Math.random(),randomFlag = random > .5;
            current2 ++;
        meetingHtml += '<span class="carousel-item" data-id="'+ Math.round(random * 5000) +'"><span class="' + (randomFlag ? "enable-badge" : "disable-badge")+ '">' + (randomFlag ? "未" : "已") + "预定</span></span>";
    }
    $("#table-carousel-gallery").children().first().html(meetingHtml);
   // create over

    //create multiple table row
    $("#reservation-data").append(function(){
         var row = $("#reservation-data").children().first().clone();
         row.find("[id]").removeAttr("id");
         return [row ,row.clone()];
    });
    //create over


    var itemWidth = carouselDate.width() / 10;
    nextBtn.click(function(){
        carouselDate.add("#reservation-data .carousel-gallery").scrollLeft(carouselDate.scrollLeft() + itemWidth);
    });
    prevBtn.click(function(){
        carouselDate.add("#reservation-data .carousel-gallery").scrollLeft(carouselDate.scrollLeft() - itemWidth);
    });

    $("#reservation-data").on("click",".carousel-item",function(){
       var id = $(this).data("id");
       dialog.alert("操作提示","选中的ID ：" + id);
    });
});
    
