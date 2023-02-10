// Create archvie file for Hidemaru Filer Classic
// Author  takeshi aoki
// Contact https://github.com/aotakejp
// License  http://www.opensource.org/licenses/mit-license.html  MIT License
// Version  0.1

var SUCCESS = 0
var CRITICAL = 16
var HOWTO =
  'add extension .zip .7z .tar.gz .tar.bz2 .tar.xz .tgz .tbz2 .txz .tar (default .zip)'
var EXEC_7Z = 'C:\\ProgramData\\chocolatey\\bin\\7z.exe'
var wshshell = new ActiveXObject('WScript.Shell')
var EXEC_TAR = wshshell.ExpandEnvironmentStrings(
  '%USERPROFILE%\\scoop\\shims\\tar.exe'
)
var PATH_SCOOP = wshshell.ExpandEnvironmentStrings(
  '%USERPROFILE%\\scoop\\shims'
)

function IsFileExist (filePath) {
  var fso,
    s = filePath
  fso = new ActiveXObject('Scripting.FileSystemObject')
  if (fso.FileExists(filePath)) return true
  else return false
}

function IsDirectoryExist (directoryPath) {
  var fso,
    s = directoryPath
  fso = new ActiveXObject('Scripting.FileSystemObject')
  if (fso.FolderExists(directoryPath)) return true
  else return false
}

var sourceFilePath = getItemPath(getNextItem(-1, 2))
var archiveFilePath = input(HOWTO, sourceFilePath)
if (archiveFilePath === sourceFilePath) {
  archiveFilePath += '.zip'
}
try {
  if (IsFileExist(archiveFilePath)) {
    var errorMessage = '" ' + archiveFilePath + ' " Already Exist!'
    throw errorMessage
  }
  var extension = archiveFilePath.match(
    /\.zip$|\.7z$|\.txz$|\.tbz2$|\.tgz$|\.tar\.gz$|\.tar\.bz2$|\.tar\.xz$|\.tar$/
  )
  if (extension === null) {
    var errorMessage = 'Invalid Extension!'
    throw errorMessage
  }
  var drive = sourceFilePath.match(/^[a-zA-Z]:/)
  var directoryPath = archiveFilePath.replace(/\\[^\\]+$/, '')
  if (!IsDirectoryExist(directoryPath)) {
    var errorMessage = 'Invalid Directory! " ' + directoryPath + ' "'
    throw errorMessage
  }
  var command
  if (extension == '.zip' || extension == '.7z') {
    command = EXEC_7Z + ' a '
  } else {
    sourceFilePath = sourceFilePath.replace(/^.+\\([^\\]+$)/, '$1')
    if (extension == '.txz' || extension == '.tar.xz') {
      command =
        'set PATH=' +
        PATH_SCOOP +
        ';%PATH% && ' +
        drive +
        ' && cd ' +
        directoryPath +
        ' && ' +
        EXEC_TAR +
        ' --force-local -cJf '
    }
    if (extension == '.tbz2' || extension == '.tar.bz2') {
      command =
        drive +
        ' && cd "' +
        directoryPath +
        '" && ' +
        EXEC_TAR +
        ' --force-local -cjf '
    }
    if (extension == '.tgz' || extension == '.tar.gz') {
      command =
        drive +
        ' && cd "' +
        directoryPath +
        '" && ' +
        EXEC_TAR +
        ' --force-local -czf '
    }
    if (extension == '.tar') {
      command =
        drive +
        ' && cd "' +
        directoryPath +
        '" && ' +
        EXEC_TAR +
        ' --force-local -cf '
    }
  }
  var execCommand =
    'cmd /c ' + command + '"' + archiveFilePath + '" "' + sourceFilePath + '"'
  exec = new ActiveXObject('WScript.Shell').exec(execCommand)
  var stdOut = exec.StdOut.ReadAll()
  var stdErr = exec.StdErr.ReadAll()
  var exitCode = exec.ExitCode
  exitCode === SUCCESS
    ? message('Successfully Compressed')
    : message(stdErr, CRITICAL)
  refresh(4)
} catch (error) {
  message(error, CRITICAL)
}
