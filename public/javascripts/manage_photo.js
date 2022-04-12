const edit_btn = document.querySelector(".manage_photo_edit_btn");
const save_btn = document.querySelector(".manage_photo_save_btn");
const delete_btn = document.querySelector(".manage_photo_delete_btn");

edit_btn.addEventListener('click',function(){
    if(edit_btn.classList.contains("btn-primary")){
        edit_btn.classList.add("btn-warning");
        edit_btn.classList.remove("btn-primary");
        save_btn.removeAttribute("style");
        delete_btn.removeAttribute("style");
        edit_btn.innerText = "取消";
    }
    else if(edit_btn.classList.contains("btn-warning")){
        edit_btn.classList.add("btn-primary");
        edit_btn.classList.remove("btn-warning");
        save_btn.setAttribute("style","visibility: hidden;");
        delete_btn.setAttribute("style","visibility: hidden;");
        edit_btn.innerText = "编辑";
    }
})
// 没有用了