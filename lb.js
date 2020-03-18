/**
 * @desc 涓€涓疆鎾彃浠� 
 * @author Mxsyx (zsimline@163.com)
 * @version 1.0.0
 */

class Lb {
  constructor(options) {
    this.lbBox = document.getElementById(options.id);
    this.lbItems = this.lbBox.querySelectorAll('.lb-item');
    this.lbSigns = this.lbBox.querySelectorAll('.lb-sign li');
    this.lbCtrlL = this.lbBox.querySelectorAll('.lb-ctrl')[0];
    this.lbCtrlR = this.lbBox.querySelectorAll('.lb-ctrl')[1];

    // 褰撳墠鍥剧墖绱㈠紩
    this.curIndex = 0;
    // 杞挱鐩掑唴鍥剧墖鏁伴噺
    this.numItems = this.lbItems.length;

    // 鏄惁鍙互婊戝姩
    this.status = true;

    // 杞挱閫熷害
    this.speed = options.speed || 600;
    // 绛夊緟寤舵椂
    this.delay = options.delay || 3000;

    // 杞挱鏂瑰悜
    this.direction = options.direction || 'left';

    // 鏄惁鐩戝惉閿洏浜嬩欢
    this.moniterKeyEvent = options.moniterKeyEvent || false;
    // 鏄惁鐩戝惉灞忓箷婊戝姩浜嬩欢
    this.moniterTouchEvent = options.moniterTouchEvent || false;

    this.handleEvents();
    this.setTransition();
  }

  // 寮€濮嬭疆鎾�
  start() {
    const event = {
      srcElement: this.direction == 'left' ? this.lbCtrlR : this.lbCtrlL
    };
    const clickCtrl = this.clickCtrl.bind(this);

    // 姣忛殧涓€娈垫椂闂存ā鎷熺偣鍑绘帶浠�
    this.interval = setInterval(clickCtrl, this.delay, event);
  }

  // 鏆傚仠杞挱
  pause() {
    clearInterval(this.interval);
  }

  /**
   * 璁剧疆杞挱鍥剧墖鐨勮繃娓″睘鎬�
   * 鍦ㄦ枃浠跺ご鍐呭鍔犱竴涓牱寮忔爣绛�
   * 鏍囩鍐呭寘鍚疆鎾浘鐨勮繃娓″睘鎬�
   */
  setTransition() {
    const styleElement = document.createElement('style');
    document.head.appendChild(styleElement);
    const styleRule = `.lb-item {transition: left ${this.speed}ms ease-in-out}`
    styleElement.sheet.insertRule(styleRule, 0);
  }

  // 澶勭悊鐐瑰嚮鎺т欢浜嬩欢
  clickCtrl(event) {
    if (!this.status) return;
    this.status = false;
    if (event.srcElement == this.lbCtrlR) {
      var fromIndex = this.curIndex,
        toIndex = (this.curIndex + 1) % this.numItems,
        direction = 'left';
    } else {
      var fromIndex = this.curIndex;
      toIndex = (this.curIndex + this.numItems - 1) % this.numItems,
        direction = 'right';
    }
    this.slide(fromIndex, toIndex, direction);
    this.curIndex = toIndex;
  }

  // 澶勭悊鐐瑰嚮鏍囧織浜嬩欢
  clickSign(event) {
    if (!this.status) return;
    this.status = false;
    const fromIndex = this.curIndex;
    const toIndex = parseInt(event.srcElement.getAttribute('slide-to'));
    const direction = fromIndex < toIndex ? 'left' : 'right';
    this.slide(fromIndex, toIndex, direction);
    this.curIndex = toIndex;
  }

  // 澶勭悊婊戝姩灞忓箷浜嬩欢
  touchScreen(event) {
    if (event.type == 'touchstart') {
      this.startX = event.touches[0].pageX;
      this.startY = event.touches[0].pageY;
    } else {  // touchend
      this.endX = event.changedTouches[0].pageX;
      this.endY = event.changedTouches[0].pageY;

      // 璁＄畻婊戝姩鏂瑰悜鐨勮搴�
      const dx = this.endX - this.startX
      const dy = this.startY - this.endY;
      const angle = Math.abs(Math.atan2(dy, dx) * 180 / Math.PI);

      // 婊戝姩璺濈澶煭
      if (Math.abs(dx) < 10 || Math.abs(dy) < 10) return ;

      if (angle >= 0 && angle <= 45) {
        // 鍚戝彸渚ф粦鍔ㄥ睆骞曪紝妯℃嫙鐐瑰嚮宸︽帶浠�
        this.lbCtrlL.click();
      } else if (angle >= 135 && angle <= 180) {
        // 鍚戝乏渚ф粦鍔ㄥ睆骞曪紝妯℃嫙鐐瑰嚮鍙虫帶浠�
        this.lbCtrlR.click();
      }
    }
  }

  // 澶勭悊閿洏鎸変笅浜嬩欢
  keyDown(event) {
    if (event && event.keyCode == 37) {
      this.lbCtrlL.click();
    } else if (event && event.keyCode == 39) {
      this.lbCtrlR.click();
    }
  }

  // 澶勭悊鍚勭被浜嬩欢
  handleEvents() {
    // 榧犳爣绉诲姩鍒拌疆鎾洅涓婃椂缁х画杞挱
    this.lbBox.addEventListener('mouseleave', this.start.bind(this));
    // 榧犳爣浠庤疆鎾洅涓婄Щ寮€鏃舵殏鍋滆疆鎾�
    this.lbBox.addEventListener('mouseover', this.pause.bind(this));

    // 鐐瑰嚮宸︿晶鎺т欢鍚戝彸婊戝姩鍥剧墖
    this.lbCtrlL.addEventListener('click', this.clickCtrl.bind(this));
    // 鐐瑰嚮鍙充晶鎺т欢鍚戝乏婊戝姩鍥剧墖
    this.lbCtrlR.addEventListener('click', this.clickCtrl.bind(this));

    // 鐐瑰嚮杞挱鏍囧織鍚庢粦鍔ㄥ埌瀵瑰簲鐨勫浘鐗�
    for (let i = 0; i < this.lbSigns.length; i++) {
      this.lbSigns[i].setAttribute('slide-to', i);
      this.lbSigns[i].addEventListener('click', this.clickSign.bind(this));
    }

    // 鐩戝惉閿洏浜嬩欢
    if (this.moniterKeyEvent) {
      document.addEventListener('keydown', this.keyDown.bind(this));
    }

    // 鐩戝惉灞忓箷婊戝姩浜嬩欢
    if (this.moniterTouchEvent) {
      this.lbBox.addEventListener('touchstart', this.touchScreen.bind(this));
      this.lbBox.addEventListener('touchend', this.touchScreen.bind(this));
    }
  }

  /**
   * 婊戝姩鍥剧墖
   * @param {number} fromIndex
   * @param {number} toIndex 
   * @param {string} direction
   */
  slide(fromIndex, toIndex, direction) {
    if (direction == 'left') {
      this.lbItems[toIndex].className = "lb-item next";
      var fromClass = 'lb-item active left',
          toClass = 'lb-item next left';
    } else {
      this.lbItems[toIndex].className = "lb-item prev";
      var fromClass = 'lb-item active right',
          toClass = 'lb-item prev right';
    }
    this.lbSigns[fromIndex].className = "";
    this.lbSigns[toIndex].className = "active";

    setTimeout((() => {
      this.lbItems[fromIndex].className = fromClass;
      this.lbItems[toIndex].className = toClass;
    }).bind(this), 50);

    setTimeout((() => {
      this.lbItems[fromIndex].className = 'lb-item';
      this.lbItems[toIndex].className = 'lb-item active';
      this.status = true;  // 璁剧疆涓哄彲浠ユ粦鍔�
    }).bind(this), this.speed + 50);
  }
}