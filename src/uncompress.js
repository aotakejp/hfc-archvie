// Extract archive file for Hidemaru Filer Classic
// Author  takeshi aoki
// Contact https://github.com/aotakejp
// License  http://www.opensource.org/licenses/mit-license.html  MIT License
// Version  0.1

var SUCCESS = 0
var CRITICAL = 16
var EXEC_7Z = 'C:\\ProgramData\\chocolatey\\bin\\7z.exe'
var wshshell = new ActiveXObject('WScript.Shell')
var EXEC_TAR = wshshell.ExpandEnvironmentStrings(
  '%USERPROFILE%\\scoop\\shims\\tar.exe'
)

var archiveFilePath = getItemPath(getNextItem(-1, 2))
var archiveDirectory = getDirectory()
var drive = archiveFilePath.match(/^[a-zA-Z]:/)
var archiveFileName = archiveFilePath.replace(/^.+\\([^\\]+$)/, '$1')
try {
  var extension = archiveFilePath.match(/(\.[^\.]+)?\.[^\.]+$/)
  if (extension === null) {
    var errorMessage = 'Invalid Extension!'
    throw errorMessage
  }
  var command =
    EXEC_7Z + ' x -o"' + archiveDirectory + '" "' + archiveFilePath + '" -aos'
  var tarExtension = archiveFilePath.match(
    /\.tgz$|\.tbz2$|\.txz$|\.tar\.gz$|\.tar\.bz2$|\.tar\.xz$|\.tar$/
  )
  if (tarExtension != null) {
    var option =
      tarExtension == '.txz' || tarExtension == '.tar.xz' ? '-xJkf' : '-xkf'
    command =
      drive +
      ' && cd "' +
      archiveDirectory +
      '" && ' +
      EXEC_TAR +
      ' --force-local ' +
      option +
      ' "' +
      archiveFileName +
      '"'
  }
  var execCommand = 'cmd /c ' + command
  exec = new ActiveXObject('WScript.Shell').exec(execCommand)
  var stdOut = exec.StdOut.ReadAll()
  var stdErr = exec.StdErr.ReadAll()
  var exitCode = exec.ExitCode
  exitCode === SUCCESS
    ? message('Successfully Uncompressed')
    : message(stdErr, CRITICAL)
  refresh(4)
} catch (error) {
  message(error, CRITICAL)
}
