// View contents of archive file for Hidemaru Filer Classic
// Author  takeshi aoki
// Contact https://bit.ly/aotakejp  https://github.com/aotakejp
// License  http://www.opensource.org/licenses/mit-license.html  MIT License
// Version  0.1

var SUCCESS = 0
var CRITICAL = 16
var EXEC_7Z = 'C:\\ProgramData\\chocolatey\\bin\\7z.exe'
var EXEC_TAR = '%USERPROFILE%\\scoop\\shims\\tar.exe --force-local'

var archiveFilePath = getItemPath(getNextItem(-1, 2))
try {
  var extension = archiveFilePath.match(
    /\.zip$|\.7z$|\.txz$|\.tbz2$|\.tgz$|\.tar\.gz$|\.tar\.bz2$|\.tar\.xz$|\.tar$/
  )
  if (extension === null) {
    var errorMessage = 'Invalid Extension!'
    throw errorMessage
  }
  var command =
    extension == '.zip' || extension == '.7z'
      ? EXEC_7Z + ' l '
      : extension == '.txz' || extension == '.tar.xz'
      ? EXEC_TAR + ' -tvJf '
      : EXEC_TAR + ' -tvf '
  var execCommand = 'cmd /c ' + command + '"' + archiveFilePath + '"'
  exec = new ActiveXObject('WScript.Shell').exec(execCommand)
  var stdOut = exec.StdOut.ReadAll()
  var stdErr = exec.StdErr.ReadAll()
  var exitCode = exec.ExitCode
  exitCode === SUCCESS ? message(stdOut) : message(stdErr, CRITICAL)
} catch (error) {
  message(error, CRITICAL)
}
