export const downloadFileFromResource = (res) => {
  {
    const name = res.headers['content-disposition'].split('=')[1].replace(/"/g, '')
    const file = new Blob([res.data], { type: 'application/octet-stream' })
    if (window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(file, name) // IE10+
    } else {
      // Others
      let a = document.createElement('a')
      let url = URL.createObjectURL(file)
      a.href = url
      a.download = name
      document.body.appendChild(a)
      a.click()
      setTimeout(function () {
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
      }, 0)
    }
  }
}
