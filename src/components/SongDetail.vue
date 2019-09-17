<template>
  <div class="songDetail">
    
    <div class="main" v-html="Lyric">
      <!-- {{ Lyric }} -->
    </div>
    <div class="audioadd">
      <audio
        :src="audioadd"
        height="0"
        width="0"
        id="music"
        autoplay
        controls="controls"
        style="display: none;"
      >Your browser does not support the audio element.</audio>
      <div class="progress">
        <span class="start"></span>
        <div class="progress-bar">
          <div class="now"></div>
        </div>
        <span class="end"></span>
      </div>
    </div>
    <div class="func">
      <div>
        <img class="xh" src="@/assets/xunhuanbofang.png" alt>
      </div>
      <div>
        <img class="prev" src="@/assets/shangyishou.png" alt>
      </div>
      <div>
        <img class="play" src="@/assets/bofang.png" style="width:80%;" alt>
        <img class="pause" src="@/assets/bofangzanting.png" style="width:80%;" alt>
      </div>
      <div>
        <img class="next" src="@/assets/xiayishou.png" alt>
      </div>
      <div>
        <img class="xh" src="@/assets/播放列表.png" @click="playLists" alt>
      </div>
    </div>
    <div class="bottom-btn" v-show="playList%2==0">
      <div class="commit" @click="commit">完成</div>
      <div class="close" @click="close">关闭</div>
    </div>

    <div class="playList" v-show="playList%2==0">
      <ul @click="handleClick">
        <li v-for="(item, index) in list" :key="index">
          <label class="my_protocol" style="margin-left: 10px;vertical-align: text-bottom;">
            <input class="input_agreement_protocol" type="checkbox">
            <span :data-num="list[index].audioadd"></span>
          </label>
          <i @click="clickI($event)">{{ list[index].ke_ename }}</i>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { songMenuSelect } from "@/common/js/api";
export default {
  data() {
    return {
      name: "",
      Lyric: "",
      audioadd: "",
      showBtn: "true",
      playList: 1,
      list: [],
      addSongList: [],
      musicIndex: 0
    };
  },
  methods: {
    audio() {
      let that = this;
      const audio = document.getElementById("music");
      const start = document.querySelector(".start");
      const end = document.querySelector(".end");
      const progressBar = document.querySelector(".progress-bar");
      const now = document.querySelector(".now");

      const xh = document.querySelector(".xh");
      const prev = document.querySelector(".prev");
      const play = document.querySelector(".play");
      const next = document.querySelector(".next");
      const pause = document.querySelector(".pause");

      function conversion(value) {
        let minute = Math.floor(value / 60);
        minute = minute.toString().length === 1 ? "0" + minute : minute;
        let second = Math.round(value % 60);
        second = second.toString().length === 1 ? "0" + second : second;
        return `${minute}:${second}`;
      }

      audio.onloadedmetadata = function() {
        end.innerHTML = conversion(audio.duration);
        start.innerHTML = conversion(audio.currentTime);
      };

      progressBar.addEventListener("click", function(event) {
        let coordStart = this.getBoundingClientRect().left;
        let coordEnd = event.pageX;
        let p = (coordEnd - coordStart) / this.offsetWidth;
        now.style.width = p.toFixed(3) * 100 + "%";

        audio.currentTime = p * audio.duration;
        audio.play();
      });

      play.addEventListener("click", function() {
        if (document.querySelector(".end").innerText == "00:00") {
        } else {
          audio.play();
          play.setAttribute("style", "display: none !important");
          pause.setAttribute("style", "display: inline-block !important");
        }
      });
      pause.addEventListener("click", function() {
        if (document.querySelector(".end").innerText == "00:00") {
        } else {
          audio.pause();
          pause.setAttribute("style", "display: none !important");
          play.setAttribute("style", "display: inline-block !important");
        }
      });

      setInterval(() => {
        start.innerHTML = conversion(audio.currentTime);
        now.style.width =
          (audio.currentTime / audio.duration.toFixed(3)) * 100 + "%";
      }, 1000);
    },
    playLists() {
      this.playList++;
    },
    close() {
      this.playList++;
    },
    commit() {
      this.playList++;
    },
    clickI(e) {
      console.log(e.target.getAttribute("data-num"));
      this.addSongList.push(e.target.getAttribute("data-num"));
    },
    handleClick(e) {
      if (e.target.nodeName.toLowerCase() === "span") {
        const index = e.target.dataset.num;
        if (e.target.parentNode.firstChild.checked == false) {
          this.doSomething(index);
        } else {
          let i = this.addSongList.indexOf(index);
          this.addSongList.splice(i, 1);
          console.log(this.addSongList);
        }
      }
    },
    doSomething(i) {
      console.log(i);
      this.addSongList.push(i);
      console.log(this.addSongList);
    },
    nextMusic() {
      let that = this;
      let audio = document.getElementById("music");
      const play = document.querySelector(".play");
      const pause = document.querySelector(".pause");
      audio.loop = false;
      audio.addEventListener(
        "ended",
        function() {
          console.log(that.musicIndex);
          that.musicIndex = that.musicIndex + 1;
          console.log(that.addSongList);
          console.log(that.musicIndex);
          console.log(that.addSongList[that.musicIndex]);
          if (that.addSongList[that.musicIndex] == undefined) {
            play.setAttribute("style", "display: inline-block !important");
            pause.setAttribute("style", "display: none !important");
          } else {
            audio.setAttribute("src", that.addSongList[that.musicIndex]);
          }
        },
        false
      );
    },
    nextMusicBtn() {
      let that = this;
      let audio = document.getElementById("music");
      let nextBtn = document.querySelector(".next");
      const play = document.querySelector(".play");
      const pause = document.querySelector(".pause");
      const now = document.querySelector(".now");
      const start = document.querySelector(".start");
      const end = document.querySelector(".end");
      nextBtn.addEventListener(
        "click",
        function() {
          console.log(audio.getAttribute("src"));
          let newPosition = that.addSongList.indexOf(audio.getAttribute("src"));
          console.log(newPosition);
          // that.musicIndex = that.musicIndex + 1;
          // console.log(that.addSongList);
          // console.log(that.musicIndex);
          // console.log(that.addSongList[that.musicIndex]);
          if (that.addSongList[newPosition + 1] == undefined) {
            play.setAttribute("style", "display: inline-block !important");
            pause.setAttribute("style", "display: none !important");
            audio.setAttribute("src", "");
            now.setAttribute("style", "width: 0");
            start.innerHTML = "00:00";
            end.innerHTML = "00:00";
          } else {
            play.setAttribute("style", "display: none !important");
            pause.setAttribute("style", "display: inline-block !important");
            audio.setAttribute("src", that.addSongList[newPosition + 1]);
          }
        },
        false
      );
    },
    prevMusicBtn() {
      let that = this;
      let audio = document.getElementById("music");
      let nextBtn = document.querySelector(".prev");
      const play = document.querySelector(".play");
      const pause = document.querySelector(".pause");
      const now = document.querySelector(".now");
      const start = document.querySelector(".start");
      const end = document.querySelector(".end");
      nextBtn.addEventListener(
        "click",
        function() {
          console.log(audio.getAttribute("src"));
          let newPosition = that.addSongList.indexOf(audio.getAttribute("src"));
          console.log(newPosition);
          // that.musicIndex = that.musicIndex + 1;
          // console.log(that.addSongList);
          // console.log(that.musicIndex);
          // console.log(that.addSongList[that.musicIndex]);
          if (that.addSongList[newPosition - 1] == undefined) {
            play.setAttribute("style", "display: inline-block !important");
            pause.setAttribute("style", "display: none !important");
            audio.setAttribute("src", "");
            now.setAttribute("style", "width: 0");
            start.innerHTML = "00:00";
            end.innerHTML = "00:00";
          } else {
            play.setAttribute("style", "display: none !important");
            pause.setAttribute("style", "display: inline-block !important");
            audio.setAttribute("src", that.addSongList[newPosition - 1]);
          }
        },
        false
      );
    }
  },
  created() {
    this.Lyric = JSON.parse(sessionStorage.getItem("Lyric"));
    this.name = JSON.parse(sessionStorage.getItem("name"));
    this.audioadd = JSON.parse(sessionStorage.getItem("audioadd"));
    songMenuSelect("1").then(res => {
      // console.log(res);
      this.list = res;
    });
  },
  mounted() {
    this.audio();
    this.nextMusic();
    this.nextMusicBtn();
    this.prevMusicBtn();
  }
};
</script>
<style lang="less">
.songDetail {
  background: #e7ded2;
  position: relative;
  .header {
    color: #4a4a4a;
    font-size: 20px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background: #fff;
    z-index: 2;
    img {
      /* font-size: 40px; */
      display: inline-block;
      width: 30px;
      /* vertical-align: initial; */
      /* margin-left: 10px; */
      /* float: left; */
      position: relative;
      left: -70px;
    }
    span {
      vertical-align: super;
    }
  }
  .main {
    padding-top: 40px;
    text-align: center;
    height: 460px;
    overflow: auto;
  }
  .func {
    position: fixed;
    bottom: 15px;;
    display: flex;
    justify-content: space-between;
    height: 55px;
    // display: none;
    div {
      display: inline-block;
      width: 15%;
      margin-right: -3px;
      text-align: center;
      line-height: 55px;
      img {
        display: inline-block;
        width: 50%;
      }
    }
  }
  .audioadd {
    * {
      margin: 0;
      padding: 0;
    }

    .progress {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 370px;
      margin: 40px auto;
    }

    .progress-bar {
      position: relative;
      width: 70%;
      height: 5px;
      background-color: #eee;
      vertical-align: 2px;
      border-radius: 3px;
      cursor: pointer;
    }

    .now {
      position: absolute;
      left: 0;
      display: inline-block;
      height: 5px;
      width: 70%;
      background: #31c27c;
    }

    .now::after {
      content: "";
      position: absolute;
      left: 100%;
      width: 3px;
      height: 7px;
      background-color: lightblue;
    }
  }
  .playList {
    // border: 1px solid red;
    width: 100%;
    height: 400px;
    overflow: auto;
    position: fixed;
    bottom: 40px;
    z-index: 5;
    background: #fff;
    ul {
      overflow: auto;
      li {
        height: 40px;
        line-height: 40px;

        border-bottom: 1px solid #dcdcdc;
        // position: relative;
        /*隐藏掉我们模型的checkbox*/
        .my_protocol .input_agreement_protocol {
          appearance: none;
          -webkit-appearance: none;
          outline: none;
          display: none;
        }
        /*未选中时*/
        .my_protocol .input_agreement_protocol + span {
          width: 16px;
          height: 16px;
          background-color: red;
          display: inline-block;
          background: url(../assets/icon_checkbox.png) no-repeat;
          background-position-x: 0px;
          background-position-y: -25px;
          position: relative;
          top: 3px;
        }
        /*选中checkbox时,修改背景图片的位置*/
        .my_protocol .input_agreement_protocol:checked + span {
          background-position: 0 0px;
        }
        i {
          font-style: normal;
          display: inline-block;
          width: 250px;
          height: 35px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
  .close {
  }
  .bottom-btn {
    position: fixed;
    bottom: 0;
    width: 100%;
    text-align: center;
    z-index: 6;
    height: 40px;
    line-height: 40px;
    background: #fff;
    border-top: 1px solid #dcdcdc;
    .commit {
      width: 49%;
      display: inline-block;
    }
    .close {
      display: inline-block;
      width: 49%;
    }
  }
}
</style>
