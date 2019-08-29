
var bookDataFromLocalStorage = [];

$(function(){ //在所有東西載入好後，才會執行這裡
    loadBookData();
    var data = [
        {text:"資料庫",value:"database"},
        {text:"網際網路",value:"internet"},
        {text:"應用系統整合",value:"system"},
        {text:"家庭保健",value:"home"},
        {text:"語言",value:"language"}
    ]
    $("#book_category").kendoDropDownList({
        dataTextField: "text",
        dataValueField: "value",
        dataSource: data,
        index: 0,
        //建議function名稱可以以增加可辨識度命名為前提
        change: onChange
    });
    $("#bought_datepicker").kendoDatePicker({
        value:new Date(),
        //parseFormats: ["MM-dd-yyyy"],
        format: "MM-dd-yyyy"
    });
    $("#book_grid").kendoGrid({
        dataSource: {
            data: bookDataFromLocalStorage,
            schema: {
                model: {
                    fields: {
                        BookId: {type:"int"},
                        BookName: { type: "string" },
                        BookCategory: { type: "string" },
                        BookAuthor: { type: "string" },
                        BookBoughtDate: { type: "string" },
                        BookPublisher:{type: "string"}
                    }
                }
            },
            pageSize: 20,
            filter:true,
            sort:{field:"BookId", dir:"asc"} //利用此行進行排序 因為資料其實沒有完全按照順序排
        },
        toolbar: kendo.template("<div class='book-grid-toolbar'><input id='search_textbox' class='book-grid-search' placeholder='我想要找......' type='text'></input></div>"),
        height: 550,
        sortable: true,
        pageable: {
            input: true,
            numeric: false
        },
        columns: [
            { field: "BookId", title: "書籍編號",width:"10%"},
            { field: "BookName", title: "書籍名稱", width: "50%" },
            { field: "BookCategory", title: "書籍種類", width: "10%" },
            { field: "BookAuthor", title: "作者", width: "15%" },
            { field: "BookBoughtDate", title: "購買日期", width: "15%" },
            { field: "BookPublisher", title: "出版商", width: "15%" },
            { command: { text: "刪除", click: deleteBook }, title: " ", width: "120px" }
        ],
    });
    //搜尋功能
    //參考https://docs.telerik.com/kendo-ui/knowledge-base/filter-all-columns-with-one-textbox   
    $(".book-grid-search").on("input",function(){
        var message = $(".book-grid-search").val();
        var grid = $("#book_grid").data("kendoGrid");
        var filter = { logic: "or", filters: [] };
        filter.filters.push({
            field:"BookName"
            ,operator: "contains"
            ,value: message
        });
        grid.dataSource.filter(filter);        
    });     
})
//KendoWindows新增頁面
//參考 https://stackoverflow.com/questions/19703494/pop-up-the-kendo-window
$(".fieldlist").kendoWindow({
    width: "400px",
    modal: true,
    title: "圖書管理系統",
    visible: false
});
$("#first-addbtn").click(function(){
    $(".fieldlist").data("kendoWindow").center().open();
});
//新增書籍
//驗證 https://wiki.jikexueyuan.com/project/kendo-ui-development-tutorial/overview-of-kendo-ui-validator.html
$("#second-addbtn").click(function(){
    var validator = $("#book-Validator").kendoValidator({
        rules: {
            datepicker: function(input) {
                if (input.is("[data-role=datepicker]")) {
                    return input.data("kendoDatePicker").value();
                }
                else {
                    return true;
                }
            }
        },
        messages: {
            datepicker: "Please enter valid date!"
            //alert( "Please enter valid date!")
        }
    }).data("kendoValidator");
    //建議變數名稱可以設的可讀性更高 比如說可直接與後方id name相同
    var bcategory = $(".k-input").text();
    var bname = $("#book_name").val();
    var bauthor = $("#book_author").val();
    var bdate = $("#bought_datepicker").val();
    var bpublisher = $("#book_publisher").val();
    if (typeof(bcategory)=="undefined" || typeof(bname)=="undefined" || typeof(bauthor)=="undefined" || typeof(bdate)=="undefined" || typeof(bpublisher)=="undefined" )
    {
        str ="";
        if(typeof(bcategory)=="undefined")
            str = str + "category be destroy!!" + "\n";
        if(typeof(bname)=="undefined")
            str = str + "Bookname be destroy!!" + "\n";
        if(typeof(bauthor)=="undefined")
            str = str + "BookAuthor be destroy!!" + "\n";
        if(typeof(bdate)=="undefined")
            str = str +"BuyDate be destroy!!" + "\n";
        if(typeof(bpublisher)=="undefined")
            str = str +"Publisher be destroy!!" + "\n";   
        alert(str);
    }
    else if(bcategory=="" || bname=="" || bauthor=="" || bdate=="" || bpublisher == "" )
    {
        str ="";
        if(bcategory=="")
            str = str + "You Need to Input Category!!" + "\n";
        if(bname=="")
            str = str + "You Need to Input BookName!!" + "\n";
        if(bauthor=="")
            str = str + "You Need to Input BookAuthor!!" + "\n";
        if(bdate=="")
            str = str +"You Need to Input BuyDate!!" + "\n";
        if(bpublisher=="")
            str = str +"You Need to Input Publisher!!" + "\n";   
        alert(str);
    }
    else if (validator.validate())
    {        
        var detaildata = 
            {
                "BookId":bookDataFromLocalStorage[bookDataFromLocalStorage.length-1].BookId+1,
                //到bookDataFromLocalStorage中找目前最後一筆資料，並且取得他的BookId，將其加一成為最新的BookId
                //因為是以陣列的方式儲存，所以要記得-1
                "BookCategory":bcategory,
                "BookName":bname,
                "BookAuthor":bauthor,
                "BookBoughtDate":bdate,
                "BookPublisher":bpublisher
            }

        bookDataFromLocalStorage.push(JSON.parse(JSON.stringify(detaildata)));
        localStorage.setItem("bookData",JSON.stringify(bookDataFromLocalStorage));//更新資料庫
        //$("#book_grid").data("kendoGrid").dataSource.data(bookDataFromLocalStorage); 解略版
        updategrid();
        $(this).closest("[data-role=window]").data("kendoWindow").close(); //關閉KendoWindows 
        //https://docs.telerik.com/kendo-ui/controls/layout/window/how-to/add-close-button  
    }
   
})
$(".book_category").on("select",function(){
    $(".book-image").src($(this).val());
})
function loadBookData(){
    bookDataFromLocalStorage = JSON.parse(localStorage.getItem("bookData"));
    if(bookDataFromLocalStorage == null){
        bookDataFromLocalStorage = bookData;
        localStorage.setItem("bookData",JSON.stringify(bookDataFromLocalStorage));
    }
    console.log(bookDataFromLocalStorage);    
}
//更改種類之圖片
function onChange(){
    $("#book_image").attr("src","image/" + this.value() + ".jpg" )
}
//刪除資料
function deleteBook(e){
    e.preventDefault();  //如果不加此行 會直接重整頁面
    var dataItem = this.dataItem($(e.target).closest("tr")); //取得選取的那行
    var grid = $("#book_grid").data("kendoGrid"); //取得你的grid資料
    grid.dataSource.remove(dataItem);  //進行grid上的移除    
    
    //進行bookDataFromLocalStorage上的移除
    for(var i=0;i<bookDataFromLocalStorage.length;i++)
    {
        if(dataItem.BookId == bookDataFromLocalStorage[i].BookId)
        {
            bookDataFromLocalStorage.splice(i,1); //從第i筆資料開始，刪除1筆資料
            localStorage.setItem("bookData",JSON.stringify(bookDataFromLocalStorage)); //把bookDataFromLocalStorage更新，重新載入
        }
    };}

function updategrid()
{
    var grid = $("#book_grid").data("kendoGrid");
    grid.destroy();
    //destory參考網站 https://docs.telerik.com/kendo-ui/api/javascript/ui/grid/methods/destroy
    //刪除完要記得重新載入Grid
    $("#book_grid").kendoGrid({
        dataSource: {
            data: bookDataFromLocalStorage,
            schema: {
                model: {
                    fields: {
                        BookId: {type:"int"},
                        BookName: { type: "string" },
                        BookCategory: { type: "string" },
                        BookAuthor: { type: "string" },
                        BookBoughtDate: { type: "string" },
                        BookPublisher:{type: "string"}
                    }
                }
            },
            pageSize: 20,
            filter:true,
            sort:{field:"BookId", dir:"asc"} //利用此行進行排序 因為資料其實沒有完全按照順序排
        },
        toolbar: kendo.template("<div class='book-grid-toolbar'><input class='book-grid-search' placeholder='我想要找......' type='text'></input></div>"),
        height: 550,
        sortable: true,
        pageable: {
            input: true,
            numeric: false
        },
        columns: [
            { field: "BookId", title: "書籍編號",width:"10%"},
            { field: "BookName", title: "書籍名稱", width: "50%" },
            { field: "BookCategory", title: "書籍種類", width: "10%" },
            { field: "BookAuthor", title: "作者", width: "15%" },
            { field: "BookBoughtDate", title: "購買日期", width: "15%" },
            { field: "BookPublisher", title: "出版商", width: "15%" },
            { command: { text: "刪除", click: deleteBook }, title: " ", width: "120px" }
        ],
    });
}