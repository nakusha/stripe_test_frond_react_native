# React Native Install
> https://reactnative.dev/docs/environment-setup  
> git config --global http.sslVerify false  


## Install Chocolatey
> https://docs.chocolatey.org/en-us/choco/setup
> 설치(window cmd - 관리자권한)\
>> Copy & Paste\
>> @"%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe" -NoProfile -InputFormat None -ExecutionPolicy Bypass -Command "[System.Net.ServicePointManager]::SecurityProtocol = 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))" && SET "PATH=%PATH%;%ALLUSERSPROFILE%\chocolatey\bin"

### Install Package Using Chocolatey
> choco install -y nodejs.install openjdk8


## Android Setting
> Install Android Studio - Download and Install\
> https://developer.android.com/studio\
> 아래 체크박스 확인(Custom - 다체크되어 있긴함)\
>> Android SDK\
>> Android SDK Platform\
>> Android Virtual Device\
>> If you are not already using Hyper-V: Performance (Intel ® HAXM) (See here for AMD or Hyper-V)

### 실행후 우측하단 Configure->SDK Manager
> SDK Platforms\
>> Android 10.0(Android SDK Platform 29, Google APIs Intel x86 Atom System Image) -> Show Package Details\
>SDK Tools\
>> Show Package Details -> Android SDK Build-Tools -> 29.0.2\
> Apply -> Accept -> Next -> (Install) -> Finish\

## 환경변수 설정
> 사용자 환경변수->추가\
>> 이름 : ANDROID_HOME\
>>  값 : 사용자>AppData\local\android\skd(컴퓨터마다 다름)\
>>        %LOCALAPPDATA%\Android\Sdk(탐색기에서 경로 확인 가능)\

> 사용자 환경변수 Path추가\
>> %LOCALAPPDATA%\Android\Sdk\platform-tools\

## 프로젝트 생성
> npx react-native init AwesomeProject 로 프로젝트 생성가능