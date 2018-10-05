<template>
  <div class="page">
    <div class="page">
      <div class="page__hd">
        <div class="page__title">完善信息</div>
        <div class="page__desc">个人资料需填写准确，方可获取课表数据。</div>
      </div>
      <div class="weui-toptips weui-toptips_warn" v-if="showTopTip">{{ topTip }}</div>
      <div class="page__bd page__bd_spacing">
        <div class="weui-cells__title">表单</div>
        <div class="weui-cells weui-cells_after-title">
            <div class="weui-cell weui-cell_input">
                <div class="weui-cell__hd">
                    <div class="weui-label">姓名</div>
                </div>
                <div class="weui-cell__bd">
                    <input class="weui-input" placeholder="请输入姓名" v-model="myInfo.name"/>
                </div>
            </div>
            <div class="weui-cell weui-cell_input">
                <div class="weui-cell__hd">
                    <div class="weui-label">学号</div>
                </div>
                <div class="weui-cell__bd">
                    <input class="weui-input" placeholder="请输入学号" v-model="myInfo.number"/>
                </div>
            </div>
        </div>
        <checkbox-group @click="bindAgreeChange">
            <label class="weui-agree" for="weuiAgree">
            <div class="weui-agree__text">
                <checkbox class="weui-agree__checkbox" id="weuiAgree" value="agree" checked="isAgree" />
                <div class="weui-agree__checkbox-icon">
                <icon class="weui-agree__checkbox-icon-check" type="success_no_circle" size="9" v-if="isAgree"></icon>
                </div>
                阅读并同意
                <p class="weui-agree__link" @click="showNotes">《免责声明》</p>
            </div>
            </label>
        </checkbox-group>
        <button class="weui-btn" type="primary" :disabled="!isAgree" @click="submit">保存</button>
      </div>
    </div>
  </div>
</template>

<script>
import { showModal, post, get } from '@/util'
export default {
  data() {
      return {
        myInfo: {
            name: '',
            number: '',
        },
        showTopTip: false,
        topTip: '',
        isAgree: false
      }
  },
  methods: {
    async submit() {
        let flag = true
        for (let val in this.myInfo) {
            if (this.myInfo[val] === '') {
                flag = false
            }
        }
        if(!flag) {
            this.showTopTips('请完善信息！')
            console.log(this.myInfo)
        } else {
            let _this = this
            wx.showModal({
                title: '提示',
                content: '数据保存成功!',
                showCancel: false,
                success: function(res) {
                    // 存储数据
                    wx.setStorageSync('myInfo', _this.myInfo)
                    // 删除旧课表数据
                    wx.removeStorage({
                        key: 'schedule',
                        success: function(res) {
                            // 跳转
                            wx.navigateBack({
                                delta: 1
                            })
                        }
                    })
                }
            })
        }
    },
    showTopTips (val) {
        this.topTip = val
        this.showTopTip = true
        setTimeout(() => {
            this.showTopTip = false
        }, 1500)
    },
    bindAgreeChange (e) {
      if(this.isAgree == false) {
        showModal('免责声明',
`本软件的著作权归软件作者所有。用户可以自由选择是否使用本软件。如果用户完善个人信息、使用本软件，即表明用户信任该软件作者。
作者本人对任何原因在使用本软件时可能对用户自己或他人造成的任何形式的损失和伤害不承担责任。
如果作者因本软件受到伤害，如脱发等，作者有权采取包括但不限于中断使用许可、停止提供服务、限制使用、法律追究等措施。`)
      }
      this.isAgree = !this.isAgree;
    }
  },
  onShow () {
      let myInfo = wx.getStorageSync('myInfo')
      if(myInfo) this.myInfo = myInfo
  }
}

</script>
<style>

</style>
