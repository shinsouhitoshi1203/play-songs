import Play from "./player.js";



document.addEventListener("DOMContentLoaded", () => {
    // get elements
    let $ = document.querySelector.bind(document), $$ = document.querySelectorAll.bind(document); 
    // init player
    var player = new Play($('.playlist'), $('h2'), $('.cd'), $('#audio'),  $('.player'), $('.progress'));
    player.run();
})

/* 
<div class="song">
        <div class="thumb" style="background-image: url('https://i.ytimg.com/vi/jTLhQf5KJSc/maxresdefault.jpg')">
        </div>
        <div class="body">
          <h3 class="title">Music name</h3>
          <p class="author">Singer</p>
        </div>
        <div class="option">
          <i class="fas fa-ellipsis-h"></i>
        </div>
      </div>

*/