<template>
  <div class="cropper-container">
    <div class="cropper">
      <input type="file" ref="fileInput" v-show="false" @change="selectFile" accept=".png,.jpg,.jpeg,.svg" />
      <div v-if="!file" class="cropper-droparea" @drop.prevent="dropFile" @dragover.prevent>
        <img src="~/assets/img/reverse-image-search.svg" alt="Image Search" width="48" height="48" class="mb-5">
        <div class="text-center mb-5 font-weight-bold">
          Drag &amp; drop an image or <br>
          <a href="#" class="font-weight-bold" @click.prevent="triggerInput">upload an image</a>
        </div>
        <div class="mb-5 url-input">
          <b-icon icon="link45deg" scale="1.2"></b-icon>
          <input placeholder="Paste image url" type="text" class="form-control form-control-sm">
        </div>
        <div class="text-muted font-12"> JPG, PNG, or SVG; Max file size: 10 MB, Min dimensions: 200 x 200 px </div>
      </div>
      <div v-if="!file">
        <div class="font-14 mt-4 mb-3 text-center">Or try one of the examples below</div>
        <div class="d-flex justify-content-center mb-4">
          <div class="p-3 asset-card" style="width: 64px; height: 64px;">
            <img src="" alt="Ghost" class="img-fluid">
          </div>
          <div class="p-3 asset-card" style="width: 64px; height: 64px;">
            <img src="" alt="Shopping" class="img-fluid">
          </div>
          <div class="p-3 asset-card" style="width: 64px; height: 64px;">
            <img src="" alt="Designer" class="img-fluid">
          </div>
          <div class="p-3 asset-card" style="width: 64px; height: 64px;">
            <img src="" alt="Business" class="img-fluid">
          </div>
        </div>
      </div>
      <div v-if="file" class="cropper-main">
        <div :style="{width: cropperWidth + 'px', height: cropperHeight + 'px', float: 'left'}">
          <canvas
            ref="canvas"
            :width="canvasWidth"
            :height="canvasHeight"
            style="background: #ccc;"
            @mousemove="moveMouse"
            @mousedown="startDrag"
            @mouseup="stopDrag"
            @mouseleave="dragged = false"
          ></canvas>
        </div>
      </div>
      <div v-if="file" class="my-4 d-flex justify-content-center align-items-center w-100">
        <button type="button" class="btn btn-primary btn-lg" @click="doCrop">
          Search by Image
        </button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      canvas: false,
      ctx: false,
      defaultOptions: {
        aspectRatio: 1,
        closeOnSave: true,
        croppedHeight: 400,
        croppedWidth: 400,
        cropperHeight: false,
        frameLineDash: [5,3],
        frameStrokeColor: 'rgba(255, 255, 255, 0.8)',
        handleFillColor: 'rgba(255, 255, 255, 0.2)',
        handleHoverFillColor: 'rgba(255, 255, 255, 0.4)',
        handleHoverStrokeColor: 'rgba(255, 255, 255, 1)',
        handleSize: 10,
        handleStrokeColor: 'rgba(255, 255, 255, 0.8)',
        layoutBreakpoint: 850,
        maxCropperHeight: 768,
        overlayFill: 'rgba(0, 0, 0, 0.5)', // fill of the masking overlay
        resultQuality: 0.8,
        resultMimeType: 'image/jpeg'
      },
      dragged: false,
      fullWidth: 500,
      file: false,
      h: 100,
      image: false,
      imageWidth: 0,
      imageHeight: 0,
      loadingImage: false,
      minW: 8, // minimum dimensions of the cropping window
      minH: 8, // minimum dimensions of the cropping window
      mx: 0,
      my: 0,
      over: false,
      w: 100,
      x: 20,
      y: 20
    }
  },
  props: { options: Object },
  computed: {
    canvasHeight () {
      if (this.imageRatio <= this.cropperRatio) { return this.cropperHeight }
      return Math.round(this.cropperWidth / this.imageRatio)
    },
    canvasWidth () {
      if (this.imageRatio >= this.cropperRatio) { return this.cropperWidth }
      return Math.round(this.imageRatio * this.canvasHeight)
    },
    cropData () {
      let scale = Math.round((this.imageWidth / this.canvasWidth + this.imageHeight / this.canvasHeight) / .002) / 1000
      let x = this.x * scale
      let y = this.y * scale
      let w = this.w * scale
      let h = this.h * scale
      return {x, y, w, h}
    },
    cropperHeight () {
      if (this.opts.cropperHeight && this.fullWidth > this.opts.layoutBreakpoint) { return this.opts.cropperHeight - 80 }
      let calculatedHeight = Math.floor(this.cropperWidth / this.imageRatio)
      let maxHeight = this.opts.maxCropperHeight
      if (maxHeight && maxHeight > 100 && maxHeight < calculatedHeight) { return maxHeight - 80 }
      return calculatedHeight
    },
    cropperRatio () {
      return Math.round((this.cropperWidth / this.cropperHeight) * 1000) / 1000
    },
    cropperWidth () {
      let mw = this.fullWidth
      if (this.fullWidth <= this.opts.layoutBreakpoint || !this.opts.showPreview) return mw
      return Math.floor(0.65 * mw)
    },
    cx () {
      let box = this.canvas.getBoundingClientRect()
      return this.mx - box.left
    },
    cy () {
      let box = this.canvas.getBoundingClientRect()
      return this.my - box.top
    },
    imageRatio () {
      if (!this.imageHeight) return 0
      return Math.round((this.imageWidth / this.imageHeight) * 1000) / 1000
    },
    markers () {
      return {
        nw: {x: this.x - this.opts.handleSize, y: this.y - this.opts.handleSize},
        ne: {x: this.x + this.w - this.opts.handleSize, y: this.y - this.opts.handleSize},
        sw: {x: this.x - this.opts.handleSize, y: this.y + this.h - this.opts.handleSize},
        se: {x: this.x + this.w - this.opts.handleSize, y: this.y + this.h - this.opts.handleSize}
      }
    },
    opts () {
      let opts = Object.assign({}, this.defaultOptions, this.options)
      return opts
    },
    resultCanvas () {
      if (!this.image) { return false }
      let canvas = document.createElement('canvas')
      canvas.width = this.resultWidth
      canvas.height = this.resultHeight
      let ctx = canvas.getContext('2d')
      ctx.save()
      let w = canvas.width
      let h = canvas.height
      ctx.translate(canvas.width / 2, canvas.height / 2)
      ctx.drawImage(
        this.image,
        this.cropData.x,
        this.cropData.y,
        this.cropData.w,
        this.cropData.h,
        -w / 2,
        -h / 2,
        w,
        h
      )
      ctx.restore()
      return canvas
    },
    resultWidth () {
      let [ar, cw, ch] = [this.opts.aspectRatio, this.opts.croppedWidth, this.opts.croppedHeight]
      let imageFactor = Math.round((this.imageWidth / this.canvasWidth) * 1000) / 1000
      let ratio = ar ? ar : this.w / this.h
      if (cw && !ch) { return cw }
      if (!cw && !ch) { return Math.round(this.w * imageFactor) }
      if (!cw && ch) { return Math.round(ch * ratio) }
      let resultRatio = cw / ch
      if (ratio >= resultRatio) { return cw }
      return Math.round(ch * ratio)
    },
    resultHeight () {
      let [ar, cw, ch] = [this.opts.aspectRatio, this.opts.croppedWidth, this.opts.croppedHeight]
      let imageFactor = Math.round((this.imageHeight / this.canvasHeight) * 1000) / 1000
      let ratio = ar ? ar : this.w / this.h
      if (ch && !cw) { return ch }
      if (!cw && !ch) { return Math.round(this.h * imageFactor) }
      if (!ch && cw) { return Math.round(cw / ratio) }
      let resultRatio = cw / ch
      if (ratio <= resultRatio) { return ch }
      return Math.round(cw / ratio)
    }
  },
  mounted () {
    this.getFullWidth()
    this.$emit('cropper-mounted')
    window.addEventListener('resize', this.getFullWidth)
  },
  beforeDestroy () {
    this.$emit('cropper-before-destroy')
    window.removeEventListener('resize', this.getFullWidth)
  },
  methods: {
    doCrop () {
      let resultImage = this.resultCanvas.toDataURL(this.opts.resultMimeType, this.opts.resultQuality)
      let n = this.file.name.lastIndexOf('.')
      let fname = this.file.name.substring(0, n)

      let finalData = {
        originalFile: this.file,
        filename: fname,
        cropCoords: this.cropData,
        croppedImageURI: resultImage
      }

      this.resultCanvas.toBlob((blob) => {
        let nd = new Date()
        blob.lastModified = nd.getTime()
        blob.lastModifiedDate = nd
        blob.name = fname
        finalData.croppedFile = blob
        this.$emit('cropper-saved', finalData)
        if (this.opts.closeOnSave) {
          this.file = false
        }
      }, this.opts.resultMimeType, this.opts.resultQuality)
    },
    drawCanvas () {
      if (!this.ctx) { return }
      this.drawImageOnCanvas()
      this.drawOverlay()
      this.drawMarkers()
    },
    drawImageOnCanvas () {
      if (!this.image) { return }
      this.ctx.save()
      let w = this.canvasWidth
      let h = this.canvasHeight
      this.ctx.translate(this.canvasWidth / 2, this.canvasHeight / 2)
      this.ctx.drawImage(this.image, -w / 2, -h / 2, w, h)
      this.ctx.restore()
    },
    drawMarkers () {
      let [mouseX, mouseY] = [this.cx, this.cy]
      let ctx = this.ctx
      this.canvas.style.cursor = 'default'
      this.over = false
      // draw selection border
      ctx.beginPath()
      ctx.rect(this.x, this.y, this.w, this.h)
      if (ctx.isPointInPath(mouseX, mouseY)) {
        this.over = 'all'
        this.canvas.style.cursor = 'move'
      }
      ctx.setLineDash(this.opts.frameLineDash)
      ctx.strokeStyle = this.opts.frameStrokeColor
      ctx.stroke()
      // clear dash
      ctx.setLineDash([])
      // draw markers
      for (let p in this.markers) {
        let marker = this.markers[p]
        ctx.beginPath()
        ctx.rect(marker.x, marker.y, this.opts.handleSize * 2, this.opts.handleSize * 2)
        ctx.fillStyle = this.opts.handleFillColor
        ctx.strokeStyle = this.opts.handleStrokeColor
        if (ctx.isPointInPath(mouseX, mouseY)) {
          ctx.fillStyle = this.opts.handleHoverFillColor
          ctx.strokeStyle = this.opts.handleHoverStrokeColor
          this.canvas.style.cursor = p + '-resize'
          this.over = p
        }
        ctx.fill()
        ctx.stroke()
      }
    },
    drawOverlay () {
      let ctx = this.ctx
      ctx.fillStyle = this.opts.overlayFill
      ctx.fillRect(0, 0, this.canvasWidth, this.y)
      ctx.fillRect(0, this.y, this.x, this.h)
      ctx.fillRect(this.x + this.w, this.y, this.canvasWidth - (this.x + this.w), this.h)
      ctx.fillRect(0, this.y + this.h, this.canvasWidth, this.canvasHeight - (this.y + this.h))
    },
    dropFile (evt) {
      let file = evt.dataTransfer.files[0]
      this.useFile(file)
      this.getFullWidth()
    },
    getFullWidth () {
      let elSize = this.$el.getBoundingClientRect()
      this.fullWidth = elSize.width
      this.$nextTick(this.drawCanvas)
    },
    moveMouse (evt) {
      let mx = evt.clientX || evt.touches[0].clientX
      let my = evt.clientY || evt.touches[0].clientY
      let dx = mx - this.mx
      let dy = my - this.my
      if (this.dragged) { this.updateCoords(dx, dy) }
      this.mx = mx
      this.my = my
      this.drawCanvas()
    },
    selectFile (evt) {
      let file = evt.currentTarget.files[0]
      if (file) { this.useFile(file) }
      this.getFullWidth()
    },
    startCanvas () {
      if (this.image) {
        this.canvas = this.$refs.canvas
        this.ctx = this.canvas.getContext('2d')
        let [ir, ar] = [this.imageRatio, this.opts.aspectRatio]
        if (!ar) {
            this.w = Math.round(this.canvasWidth / 2)
            this.h = Math.round(this.canvasHeight / 2)
        } else if (ar >= ir) {
            this.w = Math.round(this.canvasWidth / 2)
            this.h = Math.round(this.w / ar)
        } else {
            this.h = Math.round(this.canvasHeight / 2)
            this.w = Math.round(this.h * ar)
        }
        this.x = Math.round((this.canvasWidth - this.w) / 2)
        this.y = Math.round((this.canvasHeight - this.h) / 2)
        this.drawCanvas()
      } else {
        this.canvas = false
        this.ctx = false
      }
      this.canvas.addEventListener("touchstart", (e) => {
        e.preventDefault()
        this.startDrag(e)
      })
      this.canvas.addEventListener("touchend", (e) => {
        e.preventDefault()
        this.stopDrag(e)
      })
      this.canvas.addEventListener("touchmove", (e) => {
        e.preventDefault();
        this.moveMouse(e)
      })
    },
    startDrag (e) {
      if (e.touches !== undefined ) {
        this.mx = e.touches[0].clientX
        this.my = e.touches[0].clientY
        this.drawCanvas()
      }
      this.dragged = this.over
    },
    stopDrag () {
      this.dragged = false
      let preview = this.resultCanvas.toDataURL('image/jpeg', this.opts.previewQuality)
      this.$emit('cropper-preview', preview)
    },
    triggerInput () {
      let input = this.$refs.fileInput
      input.click()
    },
    updateCoords (dx, dy) {
      let nx = this.x
      let ny = this.y
      let nw = this.w
      let nh = this.h
      let ar = this.opts.aspectRatio
      switch (this.dragged) {
      case 'all':
        nx = this.x + dx
        ny = this.y + dy
        break
      case 'nw':
        nx = this.x + dx
        ny = this.y + dy
        nw = this.w - dx
        nh = this.h - dy
        break
      case 'ne':
        ny = this.y + dy
        nw = this.w + dx
        nh = this.h - dy
        break
      case 'sw':
        nx = this.x + dx
        nw = this.w - dx
        nh = this.h + dy
        break
      case 'se':
        nw = this.w + dx
        nh = this.h + dy
        break
      }
      // keep aspect ratio
      if (ar) {
        nh = nw / ar
      }
      // keep minimal dimensions
      if (nw < this.minW || nh < this.minH) {
        if (ar && ar > 1) {
          nh = this.minH
          nw = nh * ar
        } else if (ar && ar < 1) {
          nw = this.minW
          nh = nw / ar
        } else {
          if (nw < this.minW) { nw = this.minW }
          if (nh < this.minH) { nh = this.minH }
        }
      }
      // don't expand over canvas width
      if (nw + nx > this.canvasWidth) {
        nw = this.canvasWidth - nx
        if (ar) { nh = nw / ar }
        if (nw / ar < this.minH && ar && ar > 1) {
          nh = this.minH
          nw = nh * ar
          nx = this.canvasWidth - nw
        }
        if (nw < this.minW) {
          nw = this.minW
          nx = this.canvasWidth - nw
        }
      }
      // don't expand over canvas height
      if (nh + ny > this.canvasHeight) {
        nh = this.canvasHeight - ny
        if (ar) { nw = nh * ar }
        if (nh * ar < this.minW && ar && ar < 1) {
          nw = this.minW
          nh = nw / ar
          ny = this.canvasHeight - nh
        }
        if (nh < this.minH) {
          nh = this.minH
          ny = this.canvasHeight - nh
        }
      }
      // dont cross 0 borders
      if (nx < 0) { nx = 0 }
      if (ny < 0) { ny = 0 }
      this.x = nx
      this.y = ny
      this.w = nw
      this.h = nh
    },
    useFile (file) {
      this.file = file
      this.$emit('cropper-file-selected', file)
    }
  },
  watch: {
    file (nf) {
      let reader = new FileReader()
      reader.onload = (evt) => {
        let img = new Image()
        img.onload = () => {
          this.imageWidth = img.width
          this.imageHeight = img.height
          this.image = img
          this.loadingImage = false
          this.$nextTick(this.startCanvas)
        }
        img.onerror = (error) => {
          this.loadingImage = false
          this.imageWidth = 0
          this.imageHeight = 0
          this.image = false
          this.file = false
          this.$emit('cropper-error', 'Image reading error' + error)
        }
        let input = this.$refs.fileInput
        input.val = ''
        img.src = evt.target.result
      }
      reader.onerror = (error) => {
        this.file = false
        this.$emit('cropper-error', 'File reading error' + error)
      }
      if (nf) {
        reader.readAsDataURL(this.file)
      } else {
        this.imageWidth = 0
        this.imageHeight = 0
        this.image = false
      }
    }
  }
}
</script>
<style lang="scss">
.cropper {
  .cropper-droparea {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 400px;
    border: 1px dashed #D8DBEB;
    border-radius: 8px;
    background: #FAFAFC;
    position: relative;
    overflow: hidden;
  }
  .cropper-main {
    overflow: hidden;
    text-align: center;
  }
  .url-input {
    position: relative;
    width: 306px;
    .b-icon {
      position: absolute;
      left: 8px;
      top: 8px;
    }
    .form-control {
      padding-left: 30px;
    }
  }
  .asset-card {
    border-radius: 8px;
    border: 1px solid #EBEDF5;
    margin-right: 0.75rem;
    background: #F5F6FA;
    cursor: pointer;
    transition: all 0.3s ease;
    &:hover {
      transform: scale(1.03);
      border-color: #B4BAD6;
    }
  }
}

</style>