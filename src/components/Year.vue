<template>
  <div class="year">
    <div class="header">
      <div class="playAll" @click="playAll">
        <img src="@/assets/播放.png" alt="播放按钮" />
        <span>全部播放</span>
      </div>
      <div class="diyList" @click="showList">自定义歌单</div>
    </div>
    <div
      v-show="loading === true"
      style="position: fixed; top: 40%;left: 50%;margin-left:-25px;z-index: 501"
    >
      <img
        src="@/assets/loading.png"
        class="move1"
        alt
        style="display: inline-block;width: 50px;height: 44px;"
      />
    </div>

    <div
      class="song_list"
      id="song_list"
      @click="liClick($event)"
      :class="judgeNowPlay == true || song_detail == true || playList%2==0 ? 'notScroll' : 'notScroll1' "
    >
      <ul>
        <li
          class="song_com"
          v-for="(item, index) in list"
          :key="index"
          :class="isactive == index ? 'addclass' : '' "
          @click="onclick(index, $event)"
          :data-index="index"
          :data-name="list[index].ke_ename"
        >
          <img
            class="img_around"
            :class="isactive == index ? 'move1' : '' "
            :src="list[index].imghead"
            :data-index="index"
            alt="缩略图"
          />

          <img
            class="img_small"
            :class="isactive == index ? 'move2' : '' "
            src="@/assets/儿歌_03.png"
            :data-index="index"
            alt
          />
          <i :data-index="index">{{ list[index].ke_ename }}</i>
          <img
            :data-index="index"
            v-show="isactive != index "
            class="img_play"
            src="@/assets/img_play.png"
            alt="播放图"
          />
          <img
            :data-index="index"
            v-show="isactive == index"
            class="img_play"
            src="@/assets/play.gif"
            alt="播放图"
          />
          <span class="img_blank" :class="isactive == index ? 'addclass' : '' "></span>
        </li>
      </ul>
    </div>
    <div class="footer" v-show="footerDisplay == true">
      <!-- <img src="" alt=""> -->
      <audio
        :src="nowAudioadd"
        height="0"
        width="0"
        id="music"
        autoplay
        style="display: none;"
        controls="controls"
      >Your browser does not support the audio element.</audio>
      <img :src="nowImg" alt @click="goDetail" class="footer_img move1" />
      <span @click="goDetail" class="footer_span">{{ nowName }}</span>
      <div class="footer_func">
        <img style="margin-left: 10px;display: none;" src="@/assets/播放 (1).png" alt class="pause" />
        <img style="margin-left: 10px;" src="@/assets/播放.png" alt class="play" />
        <img style="margin-left: 8px;" src="@/assets/播放列表.png" alt @click="nowPlay" />
      </div>
    </div>
    <transition name="show" v-show="playList%2==0">
      <div class="diyList_detail show" style="-webkit-overflow-scrolling: touch;" id="diyList_detail" v-show="playList%2==0">
        <ul>
          <li
            class="clickLabel"
            v-for="(item, index) in diyList"
            :data-ke_ename="diyList[index].ke_ename"
            :key="index"
            @click="checkLi($event)"
          >
            <label
              class="my_protocol"
              :data-audioadd="diyList[index].audioadd"
              :data-ke_ename="diyList[index].ke_ename"
              :data-imghead="diyList[index].imghead"
              :data-imgbg="diyList[index].imgbg"
              :data-Lyric="diyList[index].geci"
              :data-indexCheck="index"
              style="margin-left: -20px;width:0;height:0;"
            >
              <input class="input_agreement_protocol" type="checkbox" />
              <span
                class="clickSpan"
                :data-audioadd="diyList[index].audioadd"
                :data-ke_ename="diyList[index].ke_ename"
                :data-imghead="diyList[index].imghead"
                :data-imgbg="diyList[index].imgbg"
                :data-Lyric="diyList[index].geci"
                :data-indexCheck="index"
                @click.stop.prevent="clickI($event)"
              ></span>
            </label>
            <img :src="diyList[index].imghead" alt style="margin-right: 10px;" />
            <span>{{diyList[index].ke_ename}}</span>
          </li>
        </ul>
      </div>
    </transition>
    <transition name="show" v-show="playList%2==0">
      <div class="diyList_func show" v-show="playList%2==0">
        <span @click="addOk" class style="background: #F84C68; color: #fff;">完成</span>
        <span @click="close" class="close" style="color: rgb(248, 76, 104);background: #fff;">关闭</span>
      </div>
    </transition>
    <!-- 详情播放页 -->
    <transition name="show">
      <div class="song_detail show" v-show="song_detail == true">
        <img class="goback" src="@/assets/htmal5icon37.png" alt @click="goback" />
        <div class="audioaddFun show" v-show="song_detail == true">
          <div class="audioadd">
            <div class="progress">
              <span class="start" style="color: #fff;"></span>
              <div class="progress-bar">
                <div class="now"></div>
              </div>
              <span class="end" style="color: #fff;"></span>
            </div>
          </div>
          <div class="func show" v-show="song_detail == true">
            <div>
              <img
                class="xh"
                src="@/assets/danquxunhuan.png"
                @click="changeRule($event)"
                alt
                v-show="rule == 1"
              />
              <img
                class="xh"
                src="@/assets/xunhuanbofang.png"
                @click="changeRule($event)"
                alt
                v-show="rule == 2"
              />
              <img
                class="xh"
                src="@/assets/随机排序.png"
                @click="changeRule($event)"
                alt
                v-show="rule == 3"
              />
            </div>
            <div>
              <img class="prev" src="@/assets/shangyishou.png" alt @click="prevMusicBtn" />
            </div>
            <div>
              <img class="play wPlay" src="@/assets/播放.png" style="display: none!important;" alt />
              <img class="pause Hpause" src="@/assets/播放 (1).png" alt />
            </div>
            <div>
              <img class="next" src="@/assets/xiayishou.png" alt @click="nextMusicBtn" />
            </div>
            <div>
              <img class="xh" src="@/assets/播放列表.png" alt @click="nowPlay($event)" />
            </div>
          </div>
        </div>
        <div class="main show" v-html="Lyric" v-show="song_detail == true"></div>
      </div>
    </transition>

    <!-- 正在播放列表 -->
    <transition name="show" v-show="judgeNowPlay == true">
      <div class="nowPlay show" v-show="judgeNowPlay == true" @click="nowPlayChileClose($event)">
        <div class="nowPlayChile" @click="nowPlay($event)" v-show="judgeNowPlay == true">
          <ul>
            <li
              class="nowPlayDiy"
              v-for="(item, index) in judgeNowPlayList"
              :key="index"
              :class="judgeNowPlayList[index].ke_ename == nowName ? 'addclass' : '' "
              :data-name="judgeNowPlayList[index].ke_ename"
              :data-Lyric="judgeNowPlayList[index].Lyric"
              :data-audioadd="judgeNowPlayList[index].audioadd"
              :data-imghead="judgeNowPlayList[index].imghead"
              :data-imgbg="judgeNowPlayList[index].imgbg"
              @click="nowPlayDiy($event)"
            >
              <img :src="judgeNowPlayList[index].imghead" alt />
              <span>{{ judgeNowPlayList[index].ke_ename }}</span>
            </li>
          </ul>
        </div>
        <div class="nowPlayClose" @click="nowPlay($event)">关闭</div>
      </div>
    </transition>
  </div>
</template>
<script>
import { songMenuSelect } from "@/common/js/api";
import Loading from "./Loading.vue";
import { constants } from "crypto";
export default {
  components: { Loading },
  name: "Toast",
  data() {
    return {
      list: [],
      isactive: -1,
      nowName: "",
      nowImg: "",
      nowAudioadd: "",
      Lyric: "",
      newIndex: 0,
      diy: [],
      obj: {},
      judge: [],
      playList: 1,
      loading: true,
      song_detail: false,
      rule: 2,
      judgeList: 0,
      footerDisplay: false,
      judgeNowPlay: false,
      judgeNowPlayList: [],
      romove: [],
      tweJudgeList: [],
      showTrue: true,
      nowImgBg: "",
      sollor: 1,
      allPage: 0,
      flag: true,
      diysollor: 1,
      diyallPage: 0,
      diyflag: true,
      diyList: []
    };
  },
  methods: {
    onclick(index, e) {
      //将点击的元素的索引赋值给bian变量
      // console.log(index);
      // console.log(
      //   document.getElementsByClassName("song_com")[index].classList.length == 2
      // );
      // let play = document.getElementsByClassName("play");
      // let pause = document.getElementsByClassName("pause");
      const audio = document.getElementById("music");
      if (
        document.getElementsByClassName("song_com")[index].classList.length == 2
      ) {
        audio.pause();
        document
          .getElementsByClassName("song_com")
          [index].classList.remove("addclass");
        document
          .getElementsByClassName("img_blank")
          [index].classList.remove("addclass");
        document
          .getElementsByClassName("img_small")
          [index].classList.remove("move2");
        document
          .getElementsByClassName("song_com")
          [index].children[0].classList.remove("move1");
        document
          .getElementsByClassName("img_blank")
          [index].classList.remove("addclass");
        document
          .getElementsByClassName("song_com")
          [index].children[3].setAttribute("style", "display: inline-block");
        document
          .getElementsByClassName("song_com")
          [index].children[4].setAttribute("style", "display: none");
        document.getElementById("music").pause();
        document
          .getElementsByClassName("pause")[0]
          .setAttribute("style", "display: none !important");
        document
          .getElementsByClassName("play")[0]
          .setAttribute("style", "display: inline-block !important");
        document
          .getElementsByClassName("pause")[1]
          .setAttribute("style", "display: none !important");
        document
          .getElementsByClassName("play")[1]
          .setAttribute("style", "display: inline-block !important");
        document
          .getElementsByClassName("footer_img")[0]
          .classList.remove("move1");
      } else {
        audio.play();
        document
          .getElementsByClassName("song_com")
          [index].classList.add("addclass");
        document
          .getElementsByClassName("img_blank")
          [index].classList.add("addclass");
        document
          .getElementsByClassName("img_small")
          [index].classList.add("move2");
        document
          .getElementsByClassName("song_com")
          [index].children[0].classList.add("move1");
        document
          .getElementsByClassName("song_com")
          [index].children[3].setAttribute("style", "display: none");
        document
          .getElementsByClassName("song_com")
          [index].children[4].setAttribute("style", "display: inline-block");
        // document.getElementById("music").play();
        document
          .getElementsByClassName("play")[0]
          .setAttribute("style", "display: none !important");
        document
          .getElementsByClassName("pause")[0]
          .setAttribute("style", "display: inline-block !important");
        document
          .getElementsByClassName("play")[1]
          .setAttribute("style", "display: none !important");
        document
          .getElementsByClassName("pause")[1]
          .setAttribute("style", "display: inline-block !important");
        document.getElementsByClassName("footer_img")[0].classList.add("move1");
      }
      this.isactive = index;
      // console.log(this.tweJudgeList[index]%2==0, this.isactive == index);
      // console.log(this.tweJudgeList);
      sessionStorage.setItem("Lyric", JSON.stringify(this.list[index].geci));
      sessionStorage.setItem("name", JSON.stringify(this.list[index].ke_ename));
      sessionStorage.setItem(
        "audioadd",
        JSON.stringify(this.list[index].audioadd)
      );
      // console.log(this.nowName);

      this.nowName = this.list[index].ke_ename;
      this.nowImg = this.list[index].imghead;
      this.nowAudioadd = this.list[index].audioadd;
      this.Lyric = this.list[index].geci;
      this.nowImgBg = this.list[index].imgbg;
      // console.log(this.list[index].ke_ename);
      // console.log(this.nowName);
      // console.log(this.Lyric);
      this.newIndex = index;
      const that = this;
      // const audio = document.getElementById("music");
      // audio.play();
      this.judgeNowPlayList = [];
      // this.diy = [];
      this.judgeNowPlayList = this.list;
      // console.log(this.judgeNowPlayList);
      document.getElementsByClassName("song_detail")[0].style.backgroundImage =
        "url(" + this.nowImgBg + ")";
      document.getElementsByClassName("song_detail")[0].style.backgroundSize =
        "100% 100%";
    },
    ended() {
      const that = this;
      let audio = document.getElementById("music");
      let nextBtn = document.querySelector(".next");
      const play = document.getElementsByClassName("play");
      const pause = document.getElementsByClassName("pause");
      let newSrc = audio.getAttribute("src");
      audio.addEventListener(
        "ended",
        function() {
          // audio.play();
          if (that.rule == 1) {
            audio.play();
          }
          if (that.rule == 2) {
            let ke_enameArr = [];
            if (that.diy.length != 0) {
              for (let a = 0; a < that.diy.length; a++) {
                ke_enameArr.push(that.diy[a].ke_ename);
              }
              // console.log(that.nowName);
              // console.log();
              // console.log(ke_enameArr.indexOf(that.nowName) < 0 ? true : 1);
              if (ke_enameArr.indexOf(that.nowName) < 0) {
                for (let index = 0; index < that.list.length; index++) {
                  if (that.diy[0].audioadd == that.list[index].audioadd) {
                    document.getElementsByTagName("li")[index].click();
                  }
                }
              } else {
                for (let i = 0; i < that.diy.length; i++) {
                  if (that.diy[i].audioadd == audio.getAttribute("src")) {
                    // audio.setAttribute("src", this.diy[i+1].audioadd);
                    // console.log(i);
                    if (i + 1 >= that.diy.length) {
                      // audio.setAttribute("src", "");
                      // audio.setAttribute("src", this.nowAudioadd);

                      // document.getElementsByTagName("li")[0].click();
                      if (that.diy.length > 1) {
                        that.nowAudioadd = that.diy[0].audioadd;
                        that.nowName = that.diy[0].ke_ename;
                        that.nowImg = that.diy[0].imghead;
                        that.Lyric = that.diy[0].Lyric;
                        that.nowImgBg = that.diy[0].nowImgBg;
                        for (let index = 0; index < that.list.length; index++) {
                          if (
                            that.diy[0].audioadd == that.list[index].audioadd
                          ) {
                            document.getElementsByTagName("li")[index].click();
                          }
                        }
                      } else {
                        audio.play();
                      }
                    } else {
                      that.nowAudioadd = that.diy[i + 1].audioadd;
                      that.nowName = that.diy[i + 1].ke_ename;
                      that.nowImg = that.diy[i + 1].imghead;
                      that.Lyric = that.diy[i + 1].Lyric;
                      that.nowImgBg = that.diy[i + 1].nowImgBg;
                      // document.getElementsByTagName("li")[i+1].click();
                      for (let index = 0; index < that.list.length; index++) {
                        if (
                          that.diy[i + 1].audioadd == that.list[index].audioadd
                        ) {
                          // console.log(index);
                          document.getElementsByTagName("li")[index].click();
                        }
                      }
                    }
                  }
                }
              }
            } else if (that.judgeList % 2 != 0) {
              for (let i = 0; i < that.list.length; i++) {
                if (that.list[i].audioadd == audio.getAttribute("src")) {
                  // audio.setAttribute("src", this.diy[i+1].audioadd);
                  // console.log(1);
                  if (i + 2 > that.list.length) {
                    that.nowAudioadd = that.list[0].audioadd;
                    that.nowName = that.list[0].ke_ename;
                    that.nowImg = that.list[0].imghead;
                    that.Lyric = that.list[0].Lyric;
                    that.nowImgBg = that.list[0].nowImgBg;
                    document.getElementsByTagName("li")[0].click();
                  } else {
                    that.nowAudioadd = that.list[i + 1].audioadd;
                    that.nowName = that.list[i + 1].ke_ename;
                    that.nowImg = that.list[i + 1].imghead;
                    that.Lyric = that.list[i + 1].Lyric;
                    that.nowImgBg = that.list[i + 1].nowImgBg;
                    document.getElementsByTagName("li")[i + 1].click();
                  }
                }
              }
            } else {
              for (let i = 0; i < that.list.length; i++) {
                if (that.list[i].audioadd == audio.getAttribute("src")) {
                  // audio.setAttribute("src", this.diy[i+1].audioadd);
                  // console.log(1);
                  if (i + 2 > that.list.length) {
                    that.nowAudioadd = that.list[0].audioadd;
                    that.nowName = that.list[0].ke_ename;
                    that.nowImg = that.list[0].imghead;
                    that.Lyric = that.list[0].Lyric;
                    that.nowImgBg = that.list[0].nowImgBg;
                    document.getElementsByTagName("li")[0].click();
                  } else {
                    that.nowAudioadd = that.list[i + 1].audioadd;
                    that.nowName = that.list[i + 1].ke_ename;
                    that.nowImg = that.list[i + 1].imghead;
                    that.Lyric = that.list[i + 1].Lyric;
                    that.nowImgBg = that.list[i + 1].nowImgBg;

                    document.getElementsByTagName("li")[i + 1].click();
                  }
                }
              }
            }
          }
          if (that.rule == 3) {
            if (that.diy.length != 0) {
              // console.log(this.diy);
              for (let i = 0; i < that.diy.length; i++) {
                if (that.diy[i].audioadd == audio.getAttribute("src")) {
                  // audio.setAttribute("src", this.diy[i+1].audioadd);
                  // console.log(i);
                  let random = Math.floor(Math.random() * 3 + 1);
                  if (i + random > that.diy.length - 1) {
                    that.nowAudioadd = that.diy[0].audioadd;
                    that.nowName = that.diy[0].ke_ename;
                    that.nowImg = that.diy[0].imghead;
                    that.Lyric = that.diy[0].Lyric;
                    that.nowImgBg = that.diy[0].nowImgBg;
                    // document.getElementsByTagName("li")[0].click();
                    for (let index = 0; index < that.list.length; index++) {
                      if (that.diy[0].audioadd == that.list[index].audioadd) {
                        document.getElementsByTagName("li")[index].click();
                      }
                    }
                  } else {
                    that.nowAudioadd = that.diy[i + random].audioadd;
                    that.nowName = that.diy[i + random].ke_ename;
                    that.nowImg = that.diy[i + random].imghead;
                    that.Lyric = that.diy[i + random].Lyric;
                    that.nowImgBg = that.diy[i + random].nowImgBg;
                    // document.getElementsByTagName("li")[i+random].click();
                    for (let index = 0; index < that.list.length; index++) {
                      if (
                        that.diy[i + random].audioadd ==
                        that.list[index].audioadd
                      ) {
                        document.getElementsByTagName("li")[index].click();
                      }
                    }
                  }
                }
              }
            } else if (that.judgeList % 2 != 0) {
              for (let i = 0; i < that.list.length; i++) {
                if (that.list[i].audioadd == audio.getAttribute("src")) {
                  // audio.setAttribute("src", this.diy[i+1].audioadd);
                  // console.log(1);
                  let random = Math.floor(Math.random() * 3 + 1);
                  if (i + random > that.list.length - 1) {
                    that.nowAudioadd = that.list[0].audioadd;
                    that.nowName = that.list[0].ke_ename;
                    that.nowImg = that.list[0].imghead;
                    that.Lyric = that.list[0].Lyric;
                    that.nowImgBg = that.list[0].nowImgBg;
                    // document.getElementsByTagName("li")[0].click();
                  } else {
                    that.nowAudioadd = that.list[i + random].audioadd;
                    that.nowName = that.list[i + random].ke_ename;
                    that.nowImg = that.list[i + random].imghead;
                    that.Lyric = that.list[i + random].Lyric;
                    that.nowImgBg = that.list[i + random].nowImgBg;
                    document.getElementsByTagName("li")[i + random].click();
                  }
                }
              }
            } else {
              for (let i = 0; i < that.list.length; i++) {
                if (that.list[i].audioadd == audio.getAttribute("src")) {
                  // audio.setAttribute("src", this.diy[i+1].audioadd);
                  // console.log(1);
                  let random = Math.floor(Math.random() * 3 + 1);

                  if (i + random > that.list.length - 2) {
                    that.nowAudioadd = that.list[0].audioadd;
                    that.nowName = that.list[0].ke_ename;
                    that.nowImg = that.list[0].imghead;
                    that.Lyric = that.list[0].Lyric;
                    that.nowImgBg = that.list[0].nowImgBg;
                    document.getElementsByTagName("li")[0].click();
                  } else {
                    that.nowAudioadd = that.list[i + random].audioadd;
                    that.nowName = that.list[i + random].ke_ename;
                    that.nowImg = that.list[i + random].imghead;
                    that.Lyric = that.list[i + random].Lyric;
                    that.nowImgBg = that.list[i + random].nowImgBg;
                    document.getElementsByTagName("li")[i + random].click();
                  }
                }
              }
            }
          }
          document.getElementsByClassName(
            "song_detail"
          )[0].style.backgroundImage = "url(" + that.nowImgBg + ")";
          document.getElementsByClassName(
            "song_detail"
          )[0].style.backgroundSize = "100% 100%";
          pause[1].setAttribute("style", "display: inline-block !important");
          play[1].setAttribute("style", "display: none !important");
          pause[0].setAttribute("style", "display: inline-block !important");
          play[0].setAttribute("style", "display: none !important");
        },
        false
      );
    },
    audio() {
      let that = this;
      const audio = document.getElementById("music");
      const start = document.querySelector(".start");
      const end = document.querySelector(".end");
      const progressBar = document.querySelector(".progress-bar");
      const now = document.querySelector(".now");

      const xh = document.querySelector(".xh");
      const prev = document.querySelector(".prev");
      const play = document.getElementsByClassName("play");
      const next = document.querySelector(".next");
      const pause = document.getElementsByClassName("pause");
      // if (audio.getAttribute('src')!= '') {
      //     audio.play();
      // }
      function conversion(value) {
        let minute = Math.floor(value / 60);
        minute = minute.toString().length === 1 ? "0" + minute : minute;
        let second = Math.round(value % 60);
        second = second.toString().length === 1 ? "0" + second : second;
        return `${minute}:${second}`;
      }
      console.log(conversion(audio.duration));
      audio.onloadedmetadata = function() {
        end.innerHTML = conversion(audio.duration);
        console.log(conversion(audio.duration));
        start.innerHTML = conversion(audio.currentTime);
      };
      audio.addEventListener("autoPlay", function() {
        audio.play();
      });
      progressBar.addEventListener("click", function(event) {
        let coordStart = this.getBoundingClientRect().left;
        let coordEnd = event.pageX;
        let p = (coordEnd - coordStart) / this.offsetWidth;
        now.style.width = p.toFixed(3) * 100 + "%";

        audio.currentTime = p * audio.duration;
        // audio.play();
      });

      play[0].addEventListener("click", function() {
        if (document.querySelector(".end").innerText == "00:00") {
        } else {
          audio.play();
          play[0].setAttribute("style", "display: none !important");
          pause[0].setAttribute("style", "display: inline-block !important");
          play[1].setAttribute("style", "display: none !important");
          pause[1].setAttribute("style", "display: inline-block !important");

          for (
            let i = 0;
            i < document.getElementsByClassName("song_com").length;
            i++
          ) {
            if (
              document
                .getElementsByClassName("song_com")
                [i].getAttribute("data-name") == that.nowName
            ) {
              // console.log(i);
              document.getElementsByClassName("song_com")[i].click();
            }
          }
        }
      });
      pause[0].addEventListener("click", function() {
        if (document.querySelector(".end").innerText == "00:00") {
        } else {
          audio.pause();
          pause[0].setAttribute("style", "display: none !important");
          play[0].setAttribute("style", "display: inline-block !important");
          pause[1].setAttribute("style", "display: none !important");
          play[1].setAttribute("style", "display: inline-block !important");

          for (
            let i = 0;
            i < document.getElementsByClassName("song_com").length;
            i++
          ) {
            if (
              document.getElementsByClassName("song_com")[i].classList.length ==
              2
            ) {
              document
                .getElementsByClassName("song_com")
                [i].classList.remove("addclass");
              document
                .getElementsByClassName("img_small")
                [i].classList.remove("move2");
              document
                .getElementsByClassName("img_blank")
                [i].classList.remove("addclass");
              document
                .getElementsByClassName("song_com")
                [i].children[0].classList.remove("move1");
              document
                .getElementsByClassName("song_com")
                [i].children[3].setAttribute("style", "display: inline-block");
              document
                .getElementsByClassName("song_com")
                [i].children[4].setAttribute("style", "display: none");
              // document.getElementById("music").pause();
              document
                .getElementsByClassName("footer_img")[0]
                .classList.remove("move1");
            }
          }
        }
      });
      play[1].addEventListener("click", function() {
        if (document.querySelector(".end").innerText == "00:00") {
        } else {
          audio.play();
          play[1].setAttribute("style", "display: none !important");
          pause[1].setAttribute("style", "display: inline-block !important");
          play[0].setAttribute("style", "display: none !important");
          pause[0].setAttribute("style", "display: inline-block !important");

          for (
            let i = 0;
            i < document.getElementsByClassName("song_com").length;
            i++
          ) {
            if (
              document
                .getElementsByClassName("song_com")
                [i].getAttribute("data-name") == that.nowName
            ) {
              // console.log(i);
              document.getElementsByClassName("song_com")[i].click();
            }
          }
        }
      });
      pause[1].addEventListener("click", function() {
        if (document.querySelector(".end").innerText == "00:00") {
        } else {
          audio.pause();
          pause[1].setAttribute("style", "display: none !important");
          play[1].setAttribute("style", "display: inline-block !important");
          pause[0].setAttribute("style", "display: none !important");
          play[0].setAttribute("style", "display: inline-block !important");
          for (
            let i = 0;
            i < document.getElementsByClassName("song_com").length;
            i++
          ) {
            if (
              document.getElementsByClassName("song_com")[i].classList.length ==
              2
            ) {
              document
                .getElementsByClassName("song_com")
                [i].classList.remove("addclass");
              document
                .getElementsByClassName("img_small")
                [i].classList.remove("move2");
              document
                .getElementsByClassName("img_blank")
                [i].classList.remove("addclass");
              document
                .getElementsByClassName("song_com")
                [i].children[0].classList.remove("move1");
              document
                .getElementsByClassName("song_com")
                [i].children[3].setAttribute("style", "display: inline-block");
              document
                .getElementsByClassName("song_com")
                [i].children[4].setAttribute("style", "display: none");
              // document.getElementById("music").pause();
              document
                .getElementsByClassName("footer_img")[0]
                .classList.remove("move1");
            }
          }
        }
      });
      setInterval(() => {
        start.innerHTML = conversion(audio.currentTime);
        now.style.width =
          (audio.currentTime / audio.duration.toFixed(3)) * 100 + "%";
      }, 1000);
    },
    _songMenuSelect() {
      songMenuSelect(sessionStorage.getItem('yclass'), this.sollor).then(res => {
        console.log(res);
        this.list = this.list.concat(res.returnData);
        console.log(this.list);
        this.loading = false;
        this.allPage = res.total ? Math.ceil(res.total / 20) : 0;
        // console.log(this.allPage)
        for (let index = 0; index < this.list.length; index++) {
          this.tweJudgeList.push(0);
        }
        // console.log(this.tweJudgeList);
      });
    },
    _songMenuSelect1() {
      songMenuSelect(sessionStorage.getItem('yclass'), this.diysollor).then(res => {
        console.log(res);
        this.diyList = this.diyList.concat(res.returnData);
        this.loading = false;
        this.allPage = res.total ? Math.ceil(res.total / 20) : 0;
        // console.log(this.allPage)
        for (let index = 0; index < this.list.length; index++) {
          this.tweJudgeList.push(0);
        }
        // console.log(this.tweJudgeList);
      });
    },
    into() {
      var audio = document.querySelector("#music");
      document.addEventListener(
        "WeixinJSBridgeReady",
        function() {
          audio.play();
        },
        false
      );
    },
    removeClass() {
      const that = this;
      // console.log(this.tweJudgeList);
      document
        .getElementsByClassName("song_list")[0]
        .addEventListener("click", function() {
          // console.log(this.tweJudgeList);
          // console.log(
          //   document
          //     .getElementsByClassName("song_com")[0]
          //     .getAttribute("class") == "song_com addclass"
          // );
          for (let index = 0; index < that.list.length; index++) {
            that.tweJudgeList[index] = that.tweJudgeList[index] + 1;
            if (
              document.getElementsByClassName("song_com")[index].classList
                .length == 2 &&
              that.tweJudgeList[index] % 2 == 0
            ) {
              document
                .getElementsByClassName("song_com")
                [index].classList.remove("addclass");
            }
          }
        });
    },
    playAll() {
      // console.log(this.diy);

      console.log(this.list);
      console.log(this.judgeNowPlayList);
      console.log(this.diy);
      this.diy.length = 0;

      if (this.judgeNowPlayList.length != 0) {
        for (let b = 0; b < this.list.length; b++) {
          if (
            window.getComputedStyle(
              document.getElementsByClassName("clickSpan")[b]
            ).backgroundPositionY == "0px"
          ) {
            document
              .getElementsByClassName("clickSpan")
              [b].setAttribute("style", "background-position-y") == "-25px";
          }
        }
      }

      this.judge.length = 0;
      this.judgeList = this.judgeList + 1;
      let playAllIndex = 0;
      let randomNum = Math.floor(Math.random() * 3 + 1);
      this.rule = 2;
      let that = this;
      let audio = document.getElementById("music");
      const play = document.querySelector(".play");
      const pause = document.querySelector(".pause");
      audio.loop = false;
      audio.setAttribute("src", "");
      this.nowName = this.list[0].ke_ename;
      this.nowImg = this.list[0].imghead;
      this.nowAudioadd = this.list[0].audioadd;
      this.Lyric = this.list[0].Lyric;
      // console.log(this.nowName);

      // console.log(this.newIndex);
      document.getElementsByTagName("li")[0].click();

      const input = document.getElementsByClassName("input_agreement_protocol");
      for (let index = 0; index < input.length; index++) {
        input[index].checked = false;
      }
    },
    checkLi(e) {
      if (e.currentTarget.nodeName === "LI") {
        e.currentTarget.children[0].children[1].click();
      }
      if (
        window.getComputedStyle(e.currentTarget).backgroundPositionY == "-25px"
      ) {
        e.currentTarget.setAttribute("style", "background-position-y: 0");
      } else {
        e.currentTarget.setAttribute("style", "background-position-y: -25px");
      }
    },
    goDetail() {
      this.song_detail = true;
      document.getElementsByClassName("song_detail")[0].style.backgroundImage =
        "url(" + this.nowImgBg + ")";
      document.getElementsByClassName("song_detail")[0].style.backgroundSize =
        "100% 100%";
    },
    clickI(e) {
      let newArr = [];
      if (this.diy.length != 0) {
        this.judgeNowPlayList = this.diy;
      }

      let newObj = this.deepClone(this.obj);
      newObj.imghead = e.currentTarget.getAttribute("data-imghead");
      newObj.ke_ename = e.currentTarget.getAttribute("data-ke_ename");
      newObj.audioadd = e.currentTarget.getAttribute("data-audioadd");
      newObj.Lyric = e.currentTarget.getAttribute("data-Lyric");
      newObj.imgbg = e.currentTarget.getAttribute("data-imgbg");
      newObj.indexCheck = e.currentTarget.getAttribute("data-indexCheck");

      if (
        this.judge.indexOf(e.currentTarget.getAttribute("data-ke_ename")) < 0
      ) {
        this.diy.push(newObj);
        this.judge.push(e.currentTarget.getAttribute("data-ke_ename"));
      } else {
        for (let i = 0; i < this.diy.length; i++) {
          if (
            this.diy[i].ke_ename ==
            e.currentTarget.getAttribute("data-ke_ename")
          ) {
            this.diy.splice(i, 1);
            this.judge.splice(i, 1);
          }
        }
      }
      if (
        window.getComputedStyle(e.currentTarget).backgroundPositionY == "-25px"
      ) {
        e.currentTarget.setAttribute("style", "background-position-y: 0");
      } else {
        e.currentTarget.setAttribute("style", "background-position-y: -25px");
      }
    },
    deepClone(obj) {
      let _obj = JSON.stringify(obj),
        objClone = JSON.parse(_obj);
      return objClone;
    },
    addOk() {
      if (this.diy.length == 0) {
        this.$toast.center("请选择要播放的歌曲");
      } else {
        this.playList = this.playList + 1;
        let diyI = 0;

        this.nowName = this.diy[0].ke_ename;
        this.nowImg = this.diy[0].imghead;
        this.nowAudioadd = this.diy[0].audioadd;
        this.Lyric = this.diy[0].Lyric;
        this.nowImgBg = this.diy[0].imgbg;

        let that = this;
        let audio = document.getElementById("music");
        const play = document.querySelector(".play");
        const pause = document.querySelector(".pause");
        audio.loop = false;
        play.setAttribute("style", "display: none !important");
        pause.setAttribute("style", "display: inline-block !important");
        for (
          let i = 0;
          i < document.getElementsByClassName("song_com").length;
          i++
        ) {
          if (
            this.diy[0].indexCheck ==
            document
              .getElementsByClassName("song_com")
              [i].getAttribute("data-index")
          ) {
            document.getElementsByClassName("song_com")[i].click();
            audio.play();
            document
              .getElementsByClassName("song_com")
              [i].classList.add("addclass");
            document
              .getElementsByClassName("song_com")
              [i].children[0].classList.add("move1");
            document
              .getElementsByClassName("song_com")
              [i].children[3].setAttribute("style", "display: none");
            document
              .getElementsByClassName("song_com")
              [i].children[4].setAttribute("style", "display: inline-block");

            document
              .getElementsByClassName("play")[0]
              .setAttribute("style", "display: none !important");
            document
              .getElementsByClassName("pause")[0]
              .setAttribute("style", "display: inline-block !important");
            document
              .getElementsByClassName("play")[1]
              .setAttribute("style", "display: none !important");
            document
              .getElementsByClassName("pause")[1]
              .setAttribute("style", "display: inline-block !important");
            document
              .getElementsByClassName("footer_img")[0]
              .classList.add("move1");
          }
        }
        document.getElementsByClassName(
          "song_detail"
        )[0].style.backgroundImage = "url(" + this.nowImgBg + ")";
        document.getElementsByClassName("song_detail")[0].style.backgroundSize =
          "100% 100%";
      }
    },
    showList() {
      this.playList = this.playList + 1;
      this.diysollor = this.sollor;
      this.diyList = this.list;
      this.diyallPage = this.allPage;
    },
    close() {
      this.playList = this.playList + 1;
    },
    goback() {
      this.song_detail = false;
      this.judgeNowPlay = false;
    },
    nextMusicBtn() {
      // console.log(this.rule);
      let that = this;
      let audio = document.getElementById("music");
      let nextBtn = document.querySelector(".next");
      const play = document.getElementsByClassName("play");
      const pause = document.getElementsByClassName("pause");
      let newSrc = audio.getAttribute("src");
      if (this.rule == 1) {
        if (this.diy.length != 0) {
          // console.log(this.diy);
          for (let i = 0; i < this.diy.length; i++) {
            if (this.diy[i].audioadd == audio.getAttribute("src")) {
              // audio.setAttribute("src", this.diy[i+1].audioadd);
              // console.log(1);
              if (i + 2 > this.diy.length) {
                // audio.setAttribute("src", "");
                // audio.setAttribute("src", this.nowAudioadd);

                // document.getElementsByTagName("li")[0].click();
                if (this.diy.length > 1) {
                  this.nowAudioadd = this.diy[0].audioadd;
                  this.nowName = this.diy[0].ke_ename;
                  this.nowImg = this.diy[0].imghead;
                  this.Lyric = this.diy[0].Lyric;
                  this.nowImgBg = this.diy[0].nowImgBg;
                  for (let index = 0; index < this.list.length; index++) {
                    if (this.diy[0].audioadd == this.list[index].audioadd) {
                      document.getElementsByTagName("li")[index].click();
                    }
                  }
                } else {
                  audio.setAttribute("src", "");
                  audio.setAttribute("src", newSrc);
                }
              } else {
                this.nowAudioadd = this.diy[i + 1].audioadd;
                this.nowName = this.diy[i + 1].ke_ename;
                this.nowImg = this.diy[i + 1].imghead;
                this.Lyric = this.diy[i + 1].Lyric;
                this.nowImgBg = this.diy[i + 1].nowImgBg;
                // document.getElementsByTagName("li")[i+1].click();
                for (let index = 0; index < this.list.length; index++) {
                  if (this.diy[i + 1].audioadd == this.list[index].audioadd) {
                    document.getElementsByTagName("li")[index].click();
                  }
                }
              }
            }
          }
        } else if (this.judgeList % 2 != 0) {
          for (let i = 0; i < this.list.length; i++) {
            if (this.list[i].audioadd == audio.getAttribute("src")) {
              // audio.setAttribute("src", this.diy[i+1].audioadd);
              // console.log(1);
              if (i + 2 > this.list.length) {
                this.nowAudioadd = this.list[0].audioadd;
                this.nowName = this.list[0].ke_ename;
                this.nowImg = this.list[0].imghead;
                this.Lyric = this.list[0].Lyric;
                this.nowImgBg = this.list[0].nowImgBg;
                document.getElementsByTagName("li")[0].click();
              } else {
                this.nowAudioadd = this.list[i + 1].audioadd;
                this.nowName = this.list[i + 1].ke_ename;
                this.nowImg = this.list[i + 1].imghead;
                this.Lyric = this.list[i + 1].Lyric;
                this.nowImgBg = this.list[i + 1].nowImgBg;
                document.getElementsByTagName("li")[i + 1].click();
              }
            }
          }
        } else {
          for (let i = 0; i < this.list.length; i++) {
            if (this.list[i].audioadd == audio.getAttribute("src")) {
              // audio.setAttribute("src", this.diy[i+1].audioadd);
              // console.log(1);
              if (i + 2 > this.list.length) {
                this.nowAudioadd = this.list[0].audioadd;
                this.nowName = this.list[0].ke_ename;
                this.nowImg = this.list[0].imghead;
                this.Lyric = this.list[0].Lyric;
                this.nowImgBg = this.list[0].nowImgBg;
                document.getElementsByTagName("li")[0].click();
              } else {
                this.nowAudioadd = this.list[i + 1].audioadd;
                this.nowName = this.list[i + 1].ke_ename;
                this.nowImg = this.list[i + 1].imghead;
                this.Lyric = this.list[i + 1].Lyric;
                this.nowImgBg = this.list[i + 1].nowImgBg;

                document.getElementsByTagName("li")[i + 1].click();
              }
            }
          }
        }
      }
      if (this.rule == 2) {
        if (this.diy.length != 0) {
          // console.log(this.diy);
          for (let i = 0; i < this.diy.length; i++) {
            if (this.diy[i].audioadd == audio.getAttribute("src")) {
              // audio.setAttribute("src", this.diy[i+1].audioadd);
              // console.log(1);
              if (i + 2 > this.diy.length) {
                // audio.setAttribute("src", "");
                // audio.setAttribute("src", this.nowAudioadd);

                // document.getElementsByTagName("li")[0].click();
                if (this.diy.length > 1) {
                  this.nowAudioadd = this.diy[0].audioadd;
                  this.nowName = this.diy[0].ke_ename;
                  this.nowImg = this.diy[0].imghead;
                  this.Lyric = this.diy[0].Lyric;
                  this.nowImgBg = this.diy[0].nowImgBg;
                  for (let index = 0; index < this.list.length; index++) {
                    if (this.diy[0].audioadd == this.list[index].audioadd) {
                      document.getElementsByTagName("li")[index].click();
                    }
                  }
                } else {
                  audio.setAttribute("src", "");
                  audio.setAttribute("src", newSrc);
                }
              } else {
                this.nowAudioadd = this.diy[i + 1].audioadd;
                this.nowName = this.diy[i + 1].ke_ename;
                this.nowImg = this.diy[i + 1].imghead;
                this.Lyric = this.diy[i + 1].Lyric;
                this.nowImgBg = this.diy[i + 1].nowImgBg;
                // document.getElementsByTagName("li")[i+1].click();
                for (let index = 0; index < this.list.length; index++) {
                  if (this.diy[i + 1].audioadd == this.list[index].audioadd) {
                    document.getElementsByTagName("li")[index].click();
                  }
                }
              }
            }
          }
        } else if (this.judgeList % 2 != 0) {
          for (let i = 0; i < this.list.length; i++) {
            if (this.list[i].audioadd == audio.getAttribute("src")) {
              // audio.setAttribute("src", this.diy[i+1].audioadd);
              // console.log(1);
              if (i + 2 > this.list.length) {
                this.nowAudioadd = this.list[0].audioadd;
                this.nowName = this.list[0].ke_ename;
                this.nowImg = this.list[0].imghead;
                this.Lyric = this.list[0].Lyric;
                this.nowImgBg = this.list[0].nowImgBg;
                document.getElementsByTagName("li")[0].click();
              } else {
                this.nowAudioadd = this.list[i + 1].audioadd;
                this.nowName = this.list[i + 1].ke_ename;
                this.nowImg = this.list[i + 1].imghead;
                this.Lyric = this.list[i + 1].Lyric;
                this.nowImgBg = this.list[i + 1].nowImgBg;
                document.getElementsByTagName("li")[i + 1].click();
              }
            }
          }
        } else {
          for (let i = 0; i < this.list.length; i++) {
            if (this.list[i].audioadd == audio.getAttribute("src")) {
              // audio.setAttribute("src", this.diy[i+1].audioadd);
              // console.log(1);
              if (i + 2 > this.list.length) {
                this.nowAudioadd = this.list[0].audioadd;
                this.nowName = this.list[0].ke_ename;
                this.nowImg = this.list[0].imghead;
                this.Lyric = this.list[0].Lyric;
                this.nowImgBg = this.list[0].nowImgBg;
                document.getElementsByTagName("li")[0].click();
              } else {
                this.nowAudioadd = this.list[i + 1].audioadd;
                this.nowName = this.list[i + 1].ke_ename;
                this.nowImg = this.list[i + 1].imghead;
                this.Lyric = this.list[i + 1].Lyric;
                this.nowImgBg = this.list[i + 1].nowImgBg;

                document.getElementsByTagName("li")[i + 1].click();
              }
            }
          }
        }
      }
      if (this.rule == 3) {
        if (this.diy.length != 0) {
          // console.log(this.diy);
          for (let i = 0; i < this.diy.length; i++) {
            if (this.diy[i].audioadd == audio.getAttribute("src")) {
              // audio.setAttribute("src", this.diy[i+1].audioadd);
              // console.log(i);
              let random = Math.floor(Math.random() * 3 + 1);
              if (i + random > this.diy.length - 1) {
                this.nowAudioadd = this.diy[0].audioadd;
                this.nowName = this.diy[0].ke_ename;
                this.nowImg = this.diy[0].imghead;
                this.Lyric = this.diy[0].Lyric;
                this.nowImgBg = this.diy[0].nowImgBg;
                // document.getElementsByTagName("li")[0].click();
                for (let index = 0; index < this.list.length; index++) {
                  if (this.diy[0].audioadd == this.list[index].audioadd) {
                    document.getElementsByTagName("li")[index].click();
                  }
                }
              } else {
                this.nowAudioadd = this.diy[i + random].audioadd;
                this.nowName = this.diy[i + random].ke_ename;
                this.nowImg = this.diy[i + random].imghead;
                this.Lyric = this.diy[i + random].Lyric;
                this.nowImgBg = this.diy[i + random].nowImgBg;
                // document.getElementsByTagName("li")[i+random].click();
                for (let index = 0; index < this.list.length; index++) {
                  if (
                    this.diy[i + random].audioadd == this.list[index].audioadd
                  ) {
                    document.getElementsByTagName("li")[index].click();
                  }
                }
              }
            }
          }
        } else if (this.judgeList % 2 != 0) {
          for (let i = 0; i < this.list.length; i++) {
            if (this.list[i].audioadd == audio.getAttribute("src")) {
              // audio.setAttribute("src", this.diy[i+1].audioadd);
              // console.log(1);
              let random = Math.floor(Math.random() * 3 + 1);
              if (i + random > this.list.length - 1) {
                this.nowAudioadd = this.list[0].audioadd;
                this.nowName = this.list[0].ke_ename;
                this.nowImg = this.list[0].imghead;
                this.Lyric = this.list[0].Lyric;
                this.nowImgBg = this.list[0].nowImgBg;
                // document.getElementsByTagName("li")[0].click();
              } else {
                this.nowAudioadd = this.list[i + random].audioadd;
                this.nowName = this.list[i + random].ke_ename;
                this.nowImg = this.list[i + random].imghead;
                this.Lyric = this.list[i + random].Lyric;
                this.nowImgBg = this.list[i + random].nowImgBg;
                document.getElementsByTagName("li")[i + random].click();
              }
            }
          }
        } else {
          for (let i = 0; i < this.list.length; i++) {
            if (this.list[i].audioadd == audio.getAttribute("src")) {
              // audio.setAttribute("src", this.diy[i+1].audioadd);
              // console.log(1);
              let random = Math.floor(Math.random() * 3 + 1);

              if (i + random > this.list.length - 2) {
                this.nowAudioadd = this.list[0].audioadd;
                this.nowName = this.list[0].ke_ename;
                this.nowImg = this.list[0].imghead;
                this.Lyric = this.list[0].Lyric;
                this.nowImgBg = this.list[0].nowImgBg;
                document.getElementsByTagName("li")[0].click();
              } else {
                this.nowAudioadd = this.list[i + random].audioadd;
                this.nowName = this.list[i + random].ke_ename;
                this.nowImg = this.list[i + random].imghead;
                this.Lyric = this.list[i + random].Lyric;
                this.nowImgBg = this.list[i + random].nowImgBg;
                document.getElementsByTagName("li")[i + random].click();
              }
            }
          }
        }
      }
      document.getElementsByClassName("song_detail")[0].style.backgroundImage =
        "url(" + this.nowImgBg + ")";
      document.getElementsByClassName("song_detail")[0].style.backgroundSize =
        "100% 100%";
      pause[1].setAttribute("style", "display: inline-block !important");
      play[1].setAttribute("style", "display: none !important");
      pause[0].setAttribute("style", "display: inline-block !important");
      play[0].setAttribute("style", "display: none !important");
    },
    prevMusicBtn() {
      let that = this;
      let audio = document.getElementById("music");
      let prevBtn = document.querySelector(".prev");

      const play = document.getElementsByClassName("play");
      const pause = document.getElementsByClassName("pause");
      let newSrc = audio.getAttribute("src");
      if (this.rule == 1) {
        if (this.diy.length != 0) {
          // console.log(this.diy);
          for (let i = 0; i < this.diy.length; i++) {
            if (this.diy[i].audioadd == audio.getAttribute("src")) {
              // audio.setAttribute("src", this.diy[i+1].audioadd);
              // console.log(1);
              if (i == 0) {
                if (this.diy.length > 1) {
                  this.nowAudioadd = this.diy[this.diy.length - 1].audioadd;
                  this.nowName = this.diy[this.diy.length - 1].ke_ename;
                  this.nowImg = this.diy[this.diy.length - 1].imghead;
                  this.Lyric = this.diy[this.diy.length - 1].Lyric;
                  this.nowImgBg = this.diy[this.diy.length - 1].nowImgBg;
                  // document.getElementsByTagName("li")[this.diy.length-1].click();

                  for (let index = 0; index < this.list.length; index++) {
                    if (
                      this.diy[this.diy.length - 1].audioadd ==
                      this.list[index].audioadd
                    ) {
                      document.getElementsByTagName("li")[index].click();
                    }
                  }
                } else {
                  audio.setAttribute("src", "");
                  audio.setAttribute("src", newSrc);
                }
              } else {
                this.nowAudioadd = this.diy[i - 1].audioadd;
                this.nowName = this.diy[i - 1].ke_ename;
                this.nowImg = this.diy[i - 1].imghead;
                this.Lyric = this.diy[i - 1].Lyric;
                this.nowImgBg = this.diy[i - 1].nowImgBg;
                // document.getElementsByTagName("li")[i-1].click();

                for (let index = 0; index < this.list.length; index++) {
                  if (this.diy[i - 1].audioadd == this.list[index].audioadd) {
                    document.getElementsByTagName("li")[index].click();
                  }
                }
              }
            }
          }
        } else if (this.judgeList % 2 != 0) {
          for (let i = 0; i < this.list.length; i++) {
            if (this.list[i].audioadd == audio.getAttribute("src")) {
              // audio.setAttribute("src", this.diy[i+1].audioadd);
              // console.log(i);
              if (i == 0) {
                this.nowAudioadd = this.list[this.list.length - 1].audioadd;
                this.nowName = this.list[this.list.length - 1].ke_ename;
                this.nowImg = this.list[this.list.length - 1].imghead;
                this.Lyric = this.list[this.list.length - 1].Lyric;
                this.nowImgBg = this.list[this.list.length - 1].nowImgBg;
                document
                  .getElementsByTagName("li")
                  [this.list.length - 1].click();
              } else {
                // console.log(this.list[12].audioadd);
                // console.log(i-1);
                // console.log(this.list[i-1].audioadd);
                this.nowAudioadd = this.list[i - 1].audioadd;
                this.nowName = this.list[i - 1].ke_ename;
                this.nowImg = this.list[i - 1].imghead;
                this.Lyric = this.list[i - 1].Lyric;
                this.nowImgBg = this.list[i - 1].nowImgBg;
                document.getElementsByTagName("li")[i - 1].click();
              }
            }
          }
        } else {
          for (let i = 0; i < this.list.length; i++) {
            if (this.list[i].audioadd == audio.getAttribute("src")) {
              // audio.setAttribute("src", this.diy[i+1].audioadd);
              // console.log(1);
              if (i == 0) {
                this.nowAudioadd = this.list[this.list.length - 1].audioadd;
                this.nowName = this.list[this.list.length - 1].ke_ename;
                this.nowImg = this.list[this.list.length - 1].imghead;
                this.Lyric = this.list[this.list.length - 1].Lyric;
                this.nowImgBg = this.list[this.list.length - 1].nowImgBg;
                document
                  .getElementsByTagName("li")
                  [this.list.length - 1].click();
              } else {
                this.nowAudioadd = this.list[i - 1].audioadd;
                this.nowName = this.list[i - 1].ke_ename;
                this.nowImg = this.list[i - 1].imghead;
                this.Lyric = this.list[i - 1].Lyric;
                this.nowImgBg = this.list[i - 1].nowImgBg;

                document.getElementsByTagName("li")[i - 1].click();
              }
            }
          }
        }
      }
      if (this.rule == 2) {
        if (this.diy.length != 0) {
          for (let i = 0; i < this.diy.length; i++) {
            if (this.diy[i].audioadd == audio.getAttribute("src")) {
              if (i == 0) {
                if (this.diy.length > 1) {
                  this.nowAudioadd = this.diy[this.diy.length - 1].audioadd;
                  this.nowName = this.diy[this.diy.length - 1].ke_ename;
                  this.nowImg = this.diy[this.diy.length - 1].imghead;
                  this.Lyric = this.diy[this.diy.length - 1].Lyric;
                  this.nowImgBg = this.diy[this.diy.length - 1].nowImgBg;

                  for (let index = 0; index < this.list.length; index++) {
                    if (
                      this.diy[this.diy.length - 1].audioadd ==
                      this.list[index].audioadd
                    ) {
                      document.getElementsByTagName("li")[index].click();
                    }
                  }
                } else {
                  audio.setAttribute("src", "");
                  audio.setAttribute("src", newSrc);
                }
              } else {
                this.nowAudioadd = this.diy[i - 1].audioadd;
                this.nowName = this.diy[i - 1].ke_ename;
                this.nowImg = this.diy[i - 1].imghead;
                this.Lyric = this.diy[i - 1].Lyric;
                this.nowImgBg = this.diy[i - 1].nowImgBg;

                for (let index = 0; index < this.list.length; index++) {
                  if (this.diy[i - 1].audioadd == this.list[index].audioadd) {
                    document.getElementsByTagName("li")[index].click();
                  }
                }
              }
            }
          }
        } else if (this.judgeList % 2 != 0) {
          for (let i = 0; i < this.list.length; i++) {
            if (this.list[i].audioadd == audio.getAttribute("src")) {
              if (i == 0) {
                this.nowAudioadd = this.list[this.list.length - 1].audioadd;
                this.nowName = this.list[this.list.length - 1].ke_ename;
                this.nowImg = this.list[this.list.length - 1].imghead;
                this.Lyric = this.list[this.list.length - 1].Lyric;
                this.nowImgBg = this.list[this.list.length - 1].nowImgBg;
                document
                  .getElementsByTagName("li")
                  [this.list.length - 1].click();
              } else {
                this.nowAudioadd = this.list[i - 1].audioadd;
                this.nowName = this.list[i - 1].ke_ename;
                this.nowImg = this.list[i - 1].imghead;
                this.Lyric = this.list[i - 1].Lyric;
                this.nowImgBg = this.list[i - 1].nowImgBg;
                document.getElementsByTagName("li")[i - 1].click();
              }
            }
          }
        } else {
          for (let i = 0; i < this.list.length; i++) {
            if (this.list[i].audioadd == audio.getAttribute("src")) {
              if (i == 0) {
                this.nowAudioadd = this.list[this.list.length - 1].audioadd;
                this.nowName = this.list[this.list.length - 1].ke_ename;
                this.nowImg = this.list[this.list.length - 1].imghead;
                this.Lyric = this.list[this.list.length - 1].Lyric;
                this.nowImgBg = this.list[this.list.length - 1].nowImgBg;
                document
                  .getElementsByTagName("li")
                  [this.list.length - 1].click();
              } else {
                this.nowAudioadd = this.list[i - 1].audioadd;
                this.nowName = this.list[i - 1].ke_ename;
                this.nowImg = this.list[i - 1].imghead;
                this.Lyric = this.list[i - 1].Lyric;
                this.nowImgBg = this.list[i - 1].nowImgBg;

                document.getElementsByTagName("li")[i - 1].click();
              }
            }
          }
        }
      }
      if (this.rule == 3) {
        if (this.diy.length != 0) {
          // console.log(this.diy);
          let random = Math.floor(Math.random() * 3 + 1);
          for (let i = 0; i < this.diy.length; i++) {
            if (this.diy[i].audioadd == audio.getAttribute("src")) {
              // audio.setAttribute("src", this.diy[i+1].audioadd);
              // console.log(i);
              if (i - random < 0) {
                this.nowAudioadd = this.diy[this.diy.length - 1].audioadd;
                this.nowName = this.diy[this.diy.length - 1].ke_ename;
                this.nowImg = this.diy[this.diy.length - 1].imghead;
                this.Lyric = this.diy[this.diy.length - 1].Lyric;
                this.nowImgBg = this.diy[this.diy.length - 1].nowImgBg;

                for (let index = 0; index < this.list.length; index++) {
                  if (
                    this.diy[this.diy.length - 1].audioadd ==
                    this.list[index].audioadd
                  ) {
                    document.getElementsByTagName("li")[index].click();
                  }
                }
              } else {
                this.nowAudioadd = this.diy[i - random].audioadd;
                this.nowName = this.diy[i - random].ke_ename;
                this.nowImg = this.diy[i - random].imghead;
                this.Lyric = this.diy[i - random].Lyric;
                this.nowImgBg = this.diy[i - random].nowImgBg;

                for (let index = 0; index < this.list.length; index++) {
                  if (
                    this.diy[i + random].audioadd == this.list[index].audioadd
                  ) {
                    document.getElementsByTagName("li")[index].click();
                  }
                }
              }
            }
          }
        } else if (this.judgeList % 2 != 0) {
          for (let i = 0; i < this.list.length; i++) {
            let random = Math.floor(Math.random() * 3 + 1);
            if (this.list[i].audioadd == audio.getAttribute("src")) {
              // console.log(i);
              // audio.setAttribute("src", this.diy[i+1].audioadd);
              // console.log(1);
              if (i - random >= 0) {
                this.nowAudioadd = this.list[i - random].audioadd;
                this.nowName = this.list[i - random].ke_ename;
                this.nowImg = this.list[i - random].imghead;
                this.Lyric = this.list[i - random].Lyric;
                this.nowImgBg = this.list[i - random].nowImgBg;
                document.getElementsByTagName("li")[i - random].click();
              } else {
                this.nowAudioadd = this.list[this.list.length - 1].audioadd;
                this.nowName = this.list[this.list.length - 1].ke_ename;
                this.nowImg = this.list[this.list.length - 1].imghead;
                this.Lyric = this.list[this.list.length - 1].Lyric;
                this.nowImgBg = this.list[this.list.length - 1].nowImgBg;
                document
                  .getElementsByTagName("li")
                  [this.list.length - 1].click();
              }
            }
          }
        } else {
          for (let i = 0; i < this.list.length; i++) {
            let random = Math.floor(Math.random() * 3 + 1);
            if (this.list[i].audioadd == audio.getAttribute("src")) {
              // audio.setAttribute("src", this.diy[i+1].audioadd);
              // console.log(1);
              if (i - random > 0 && i - random < this.list.length) {
                this.nowAudioadd = this.list[i - random].audioadd;
                this.nowName = this.list[i - random].ke_ename;
                this.nowImg = this.list[i - random].imghead;
                this.Lyric = this.list[i - random].Lyric;
                this.nowImgBg = this.list[i - random].nowImgBg;
                document.getElementsByTagName("li")[i - random].click();
              } else {
                this.nowAudioadd = this.list[0].audioadd;
                this.nowName = this.list[0].ke_ename;
                this.nowImg = this.list[0].imghead;
                this.Lyric = this.list[0].Lyric;
                this.nowImgBg = this.list[0].nowImgBg;
                document.getElementsByTagName("li")[0].click();
              }
            }
          }
        }
      }
      document.getElementsByClassName("song_detail")[0].style.backgroundImage =
        "url(" + this.nowImgBg + ")";
      document.getElementsByClassName("song_detail")[0].style.backgroundSize =
        "100% 100%";
      pause[1].setAttribute("style", "display: inline-block !important");
      play[1].setAttribute("style", "display: none !important");
      pause[0].setAttribute("style", "display: inline-block !important");
      play[0].setAttribute("style", "display: none !important");
    },
    changeRule(e) {
      // console.log(e);
      this.rule = this.rule + 1 > 3 ? 1 : this.rule + 1;
      // console.log(this.rule);
      this.clickTop();
    },
    clickTop() {
      if (this.rule == 1) {
        this.$toast.center("单曲循环");
      } else if (this.rule == 2) {
        this.$toast.center("列表循环");
      } else if (this.rule == 3) {
        this.$toast.center("随机播放");
      }
    },
    liClick(e) {
      this.footerDisplay = true;
    },
    nowPlay(e) {
      this.judgeNowPlay = true;
      let newArr = [];
      if (this.diy.length != 0) {
        this.judgeNowPlayList = this.diy;
      } else {
        this.judgeNowPlayList = this.list;
      }

      if (e.target.innerHTML == "关闭") {
        this.judgeNowPlay = false;
      }
    },
    nowPlayDiy(e) {
      this.nowName = e.currentTarget.getAttribute("data-name");
      this.nowAudioadd = e.currentTarget.getAttribute("data-audioadd");
      this.Lyric = e.currentTarget.getAttribute("data-Lyric");
      this.nowImg = e.currentTarget.getAttribute("data-imghead");
      this.nowImgBg = e.currentTarget.getAttribute("data-imgbg");
      // e.currentTarget.classList.add
      document.getElementsByClassName("song_detail")[0].style.backgroundImage =
        "url(" + this.nowImgBg + ")";
      document.getElementsByClassName("song_detail")[0].style.backgroundSize =
        "100% 100%";

      for (let index = 0; index < this.list.length; index++) {
        if (this.nowName == this.list[index].ke_ename) {
          document.getElementsByClassName("song_com")[index].click();
        }
      }
    },
    changeHe() {
      if (document.body.clientWidth > 700) {
        document
          .getElementsByClassName("func")[0]
          .setAttribute("style", "height: 110px");
        Array.from(document.getElementsByClassName("func")[0].children).forEach(
          function(item) {
            item.style.lineHeight = "120px";
          }
        );
        document
          .getElementsByClassName("footer_span")[0]
          .setAttribute("style", "width: 500px");
      }
    },
    nowPlayChileClose(e) {
      if (e.target === e.currentTarget) {
        this.judgeNowPlay = false;
      }
    },
    // 获取文档高度
    getScrollHeight() {
      return Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight
      );
    },
    getClientHeight() {
      var clientHeight = 0;
      if (document.body.clientHeight && document.documentElement.clientHeight) {
        clientHeight = Math.min(
          document.body.clientHeight,
          document.documentElement.clientHeight
        );
      } else {
        clientHeight = Math.max(
          document.body.clientHeight,
          document.documentElement.clientHeight
        );
      }
      return clientHeight;
    },
    getScrollTop() {
      var scrollTop = 0;
      if (document.documentElement && document.documentElement.scrollTop) {
        scrollTop = document.documentElement.scrollTop;
      } else if (document.body) {
        scrollTop = document.body.scrollTop;
      }
      return scrollTop;
    },
    scroll() {
      const that = this;
      window.onscroll = function() {
        console.log(531);
        if (
          parseInt(that.getScrollTop()) + parseInt(that.getClientHeight()) ===
          parseInt(that.getScrollHeight())
        ) {
          that.sollor += 1;
          if (that.sollor > that.allPage && that.flag == true) {
            that.$toast.center("没有更多歌曲啦~");
            that.flag = false;
          } else if (that.sollor <= that.allPage) {
            that.loading = true;
            setTimeout(function() {
              that._songMenuSelect("1", that.sollor);
            }, 500);
          }
        }
      };
    },
    diyScroll() {
      document.getElementById("diyList_detail").onscroll = this.debounce(
        this.count,
        500
      );
    },
    debounce(func, wait) {
      let timeout;
      return function() {
        let context = this;
        let args = arguments;

        if (timeout) clearTimeout(timeout);

        timeout = setTimeout(() => {
          func.apply(context, args);
        }, wait);
      };
    },
    count() {
      const that = this;
      // console.log(1)
      console.log(
        parseInt(document.getElementById("diyList_detail").scrollTop)
      );
      console.log(
        parseInt(document.getElementById("diyList_detail").clientHeight)
      );
      console.log(
        parseInt(document.getElementById("diyList_detail").scrollHeight)
      );
      if (
        parseInt(document.getElementById("diyList_detail").scrollTop) +
          parseInt(document.getElementById("diyList_detail").clientHeight) +
          1 >=
        parseInt(document.getElementById("diyList_detail").scrollHeight)
      ) {
        console.log(12);
        that.diysollor += 1;
        if (that.diysollor > that.allPage && that.diyflag == true) {
          that.diyflag = false;
          that.$toast.center("没有更多歌曲啦~");
        } else if (that.diysollor <= that.allPage) {
          console.log(that.diysollor);
          console.log(that.allPage);
          that.loading = true;
          setTimeout(function() {
            that._songMenuSelect1("1", that.diysollor);
          }, 1000);
        }
      }
    }
  },
  created() {
    this._songMenuSelect();
  },
  mounted() {
    this.audio();
    this.into();
    this.changeHe();
    this.ended();
    this.scroll();
    this.diyScroll();
  }
};
</script>
<style lang="less">
.notScroll {
  position: fixed;
  width: 100%;
}
.notScroll1 {
  position: a;
  width: 100%;
}
.addclass {
  background: #f84a68 !important;
  color: #ffffff;
}
.addclass1 {
  background: #fff;
  color: #000;
}
.wPlay,
.Hpause {
  width: 80% !important;
}
.wPlay {
  display: none !important;
}
.move1 {
  animation: myMove1 5s linear infinite;
  -webkit-animation: myMove1 5s linear infinite;
}
@keyframes myMove1 {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.move2 {
  transform-origin: 0 0;
  transform: rotate(15deg);
}
.show-enter-active,
.show-leave-active {
  transition: all 0.1s;
}
.show-enter,
.show-leave-to {
  margin-left: 800px;
}
.show-enter-to,
.show-leave {
  margin-left: 0px;
}

.year {
  .header {
    color: #4a4a4a;
    font-size: 20px;
    height: 50px;
    line-height: 50px;
    // text-align: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background: #fff;
    z-index: 2;
    box-shadow: 0px -3px 30px 1px rgba(0, 0, 0, 0.2);
    .playAll {
      display: inline-block;
      img {
        display: inline-block;
        width: 30px;
        margin-left: 26px;
        margin-top: 10px;
      }
      span {
        vertical-align: top;
        font-weight: 550;
      }
    }
    .diyList {
      display: inline-block;
      vertical-align: top;
      color: #6495ed;
      float: right;
      margin-right: 30px;
    }
  }
  .song_list {
    margin-top: 50px;
    ul {
      margin: 0;
      padding: 0;
      margin-bottom: 60px;
      li {
        // border-color: #fff;
        margin-top: 8px;
        height: 60px;
        font-size: 20px;
        zoom: 1;
        border-radius: 15px;
        position: relative;
        background: #ffffff;
        .img_around {
          display: inline-block;
          width: 44px;
          height: 44px;
          margin-left: 26px;
          margin-top: 10px;
          border-radius: 50%;
        }
        .img_blank {
          display: inline-block;
          width: 10px;
          height: 10px;
          background: #fff;
          border-radius: 50%;
          position: absolute;
          left: 43px;
          top: 27px;
        }
        .img_small {
          display: inline-block;
          width: 15px;
          height: 25px;
          position: absolute;
          left: 60px;
          top: 5px;
        }

        i {
          font-style: normal;
          // margin-top: 18px;
          display: inline-block;
          vertical-align: top;
          margin-left: 25px;
          width: 155px;
          height: 30px;
          overflow: hidden;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 18px;
          height: 60px;
          line-height: 60px;
        }
        .img_play {
          float: right;
          margin-right: 30px;
          margin-top: 20px;
          width: 28px;
          height: 22px;
        }
        :after {
          display: block;
          clear: both;
          content: "";
          visibility: hidden;
          height: 0;
        }
      }
    }
  }
  .footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 60px;
    background: #fff;
    z-index: 6;
    box-shadow: 0px -3px 30px 1px rgba(0, 0, 0, 0.2);
    // font-size: 20px;
    img {
      display: inline-block;
      width: 44px;
      height: 44px;
      margin-left: 26px;
      margin-top: 10px;

      border-radius: 50%;
    }
    span {
      font-style: normal;
      // margin-top: 22px;
      display: inline-block;
      vertical-align: top;
      padding-left: 25px;
      width: 125px;
      height: 30px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 20px;
      height: 60px;
      line-height: 60px;
    }
    .footer_func {
      display: inline-block;
      display: inline-block;
      float: right;
      margin-right: 20px;
      margin-top: 20px;
      img {
        display: inline-block;
        width: 30px;
        height: 30px;
        margin: 0;
        padding: 0;
        vertical-align: super;
        border-radius: 0;
      }
    }
  }
  .diyList_detail {
    position: fixed;
    width: 100%;
    height: 100vh;
    z-index: 500;
    background: #fff;
    bottom: 0;
    overflow: auto;
    // animation: bounceInLeft 1s infinite cubic-bezier(0.215, 0.61, 0.355, 1);
    // animation-iteration-count: 1;
    ul {
      margin-bottom: 40px;
      li {
        height: 60px;
        position: relative;
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
          width: 20px;
          height: 20px;
          background-color: red;
          display: inline-block;
          background: url(../assets/icon_checkbox.png) no-repeat;
          background-position-x: 0px;
          background-position-y: -25px;
          position: relative;
          top: -14px;
          left: 40px;
          border: 1px solid #f84c68;
          background-size: 278%;
          border-radius: 5px;
        }
        /*选中checkbox时,修改背景图片的位置*/
        .my_protocol .input_agreement_protocol:checked + span {
          background-position: 0 0px;
        }
        span {
          font-style: normal;
          display: inline-block;
          width: 250px;
          height: 40px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          position: absolute;
          top: 50%;
          margin-top: -10px;
          // margin-left: 10px;
          // padding-left: 5px;
        }
        img {
          display: inline-block;
          width: 44px;
          height: 44px;
          // margin-left: 26px;
          margin-left: 50px;
          margin-top: 10px;
          border-radius: 50%;

          // vertical-align: super;
        }
      }
    }
  }
  // @keyframes bounceInLeft {
  //   from {
  //     left: -3000px;
  //   }
  //   to {
  //     left: 0px;
  //   }
  // }
  .diyList_func {
    position: fixed;
    bottom: 0;
    width: 100%;
    text-align: center;
    z-index: 1000;
    height: 40px;
    line-height: 40px;
    background: #fff;
    border-top: 1px solid #dcdcdc;
    // animation: bounceInLeft1 1s infinite cubic-bezier(0.215, 0.61, 0.355, 1);

    // animation-iteration-count: 1;
    span {
      display: inline-block;
      width: 49%;
    }
  }
  // @keyframes bounceInLeft1 {
  //   from {
  //     left: -3000px;
  //   }

  //   to {
  //     left: 0px;
  //   }
  // }
  .song_detail {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 100vh;
    background: #fff;
    z-index: 100;
    .goback {
      display: inline-block;
      width: 25px;

      position: absolute;
      top: 40px;
      left: 20px;
    }
    .main {
      padding-top: 40px;
      text-align: center;
      height: 65vh;
      overflow: auto;
      color: #fff !important;
      width: 90%;
      margin: 0 auto;
      :nth-child(2n) {
        margin-bottom: 20px;
      }
      .MsoNormal {
        color: #fff !important;
        font-size: 20px !important;
        span:first-child {
          color: #fff !important;
          font-size: 20px !important;
          font {
            color: #fff !important;
            font-size: 20px !important;
          }
        }
        font {
          color: #fff !important;
          font-size: 20px !important;
        }
      }
    }

    .audioaddFun {
      position: absolute;
      bottom: 0;
      width: 100%;
      .func {
        // position: fixed;
        // bottom: 15px;
        display: flex;
        justify-content: space-between;
        height: 55px;
        // display: none;
        margin-bottom: 20px;
        div {
          display: inline-block;
          width: 15%;
          height: 100%;
          margin-right: -3px;
          text-align: center;
          display: flex;
          display: -webkit-flex;
          justify-content: center;
          align-items: center;
          // line-height: 55px;
          position: relative;
          img {
            display: inline-block;
            width: 50%;
            position: absolute;
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
          width: 94%;
          margin: 20px auto;
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
          background: #f84a68;
        }

        .now::after {
          content: "";
          position: absolute;
          top: -4px;
          left: 100%;
          width: 2px;
          height: 2px;
          border-radius: 51%;
          border: 6px solid lightblue;
        }
      }
    }
  }
  .nowPlay {
    width: 100%;
    position: fixed;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    height: 100vh;
    z-index: 100;
    overflow: auto;
    .nowPlayChile {
      height: 70vh;
      position: fixed;
      bottom: 0;
      overflow: auto;
      width: 100%;
      background: #fff;
      color: #000;
      opacity: 1;
      z-index: 1000;
      ul {
        margin-bottom: 40px;
        li {
          height: 60px;
          line-height: 60px;
          list-style: none;
          border-bottom: 1px solid #eee;
          img {
            display: inline-block;
            width: 44px;
            height: 44px;
            margin-left: 26px;
            border-radius: 50%;
            vertical-align: middle;
          }
          span {
            margin-top: 22px;
            margin-left: 25px;
            vertical-align: middle;
          }
        }
      }
    }
    .nowPlayClose {
      background: #f84c68;
      color: #fff;
      position: fixed;
      bottom: 0;
      width: 100%;
      text-align: center;
      z-index: 1000;
      height: 40px;
      line-height: 40px;
      /* background: #fff; */
      border-top: 1px solid #dcdcdc;
    }
  }
}
</style>
