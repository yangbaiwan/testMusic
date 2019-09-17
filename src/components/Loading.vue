<template>
  <div class="box">
    <div class="loader-03"></div>
  </div>
</template>
<style lang="less" scoped>
.box {
  display: inline-block;
  width: 200px;
  height: 200px;
  border-radius: 3px;
  font-size: 30px;
  padding: 1em;
  position: relative;
  margin-bottom: 0.25em;
  vertical-align: top;
  -webkit-transition: 0.3s color, 0.3s border, 0.3s transform, 0.3s opacity;
  transition: 0.3s color, 0.3s border, 0.3s transform, 0.3s opacity;
  position: fixed;
  z-index: 1000;
  left: 40%;
  top: 30%;
  .loader-03 {
    border: 0.2em solid currentcolor;
    border-bottom-color: transparent;
    border-radius: 50%;
    -webkit-animation: 1s loader-03 linear infinite;
    animation: 1s loader-03 linear infinite;
    position: relative;
  }

  @-webkit-keyframes loader-03 {
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }

    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }

  @keyframes loader-03 {
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }

    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
}

[class*="loader-"] {
  display: inline-block;
  width: 1em;
  height: 1em;
  color: inherit;
  vertical-align: middle;
  pointer-events: none;
}
</style>

