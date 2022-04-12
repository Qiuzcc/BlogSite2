function delete_disabled() {
    document.getElementById("manage_people_name").removeAttribute("readonly");
    document.getElementById("manage_people_description").removeAttribute("readonly");
    document.getElementById("manage_people_github").removeAttribute("readonly");
    document.getElementById("manage_people_weibo").removeAttribute("readonly");
    document.getElementById("manage_people_submit").removeAttribute("disabled");
    document.getElementById("manage_people_portrait").removeAttribute("style");
    document.getElementById("manage_people_wechat").removeAttribute("style");
}

document.getElementById("manage_people_change").addEventListener("click",delete_disabled);