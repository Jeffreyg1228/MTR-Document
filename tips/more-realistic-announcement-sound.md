# 在 MTR 模组中获取更自然的报站语音

## 导言

MTR 模组的“报站声音不真实”历来是玩家反映的问题之一。而在模组 Github 仓库的议题 [#462](https://github.com/Minecraft-Transit-Railway/Minecraft-Transit-Railway/issues/462) 中，Jonathan 表示 TTS 代码上的修改超出了模组的范围。

观察代码可知，MTR 模组使用 `com.mojang.text2speech` 库，调用 `Narrator.getNarrator().say()` 方法实现文本转语音（TTS）功能。这其实是 Mojang 为实现 Minecraft 的复述功能所编写的库。点击 *Minecraft 首页 -> 选项… -> 辅助功能设置… -> 复述功能* 即可测试该功能。

由 Minecraft 源码可知，该库针对 Windows、macOS 和 Linux 三种系统做了 TTS 实现，而在 Windows 中，**其调用 SAPI 的默认语音进行合成**。这就是为什么 MTR 模组的报站声音“拉胯”——实质上是系统自带的“讲述人”语音造成的。因此，要解决此问题，有必要安装一个新的语音库。

## `NaturalVoiceSAPIAdapter` 库介绍

`NaturalVoiceSAPIAdapter` 库是一个连接 Azure AI 语音服务，使第三方程序也能使用微软自然语音的 SAPI 5 TTS 引擎（语音库）。支持如下自然语音：

- Microsoft Edge 中“大声朗读”功能的在线自然语音；
    ::: details 相关信息
    2021 年底，微软基于微软 Azure 神经网络文本转语音技术，[为 Microsoft Edge 推出了“大声朗读”（Read Aloud）功能](https://www.ithome.com/0/732/895.htm)。该功能包括各种语言的丰富自然语音，**不需要下载，但每一次合成都需要联网**。
    :::
- Windows 11 中的讲述人自然语音。
    ::: details 相关信息
    从 Windows 11 Build 23590 起，微软[为讲述人推出了自然语音（Natural Voices）支持](https://www.ithome.com/0/732/895.htm)。尽管支持的语言和语音很少，但**仅下载语音包需要联网，之后的合成均为离线合成**。
    :::

该库的作者提取了 Windows 内置的语音合成密钥，因此这些需要付费的语音合成 API 可被我们免费调用。

## 步骤一：下载 `NaturalVoiceSAPIAdapter` 安装程序

1. 从[项目 Github 仓库](https://github.com/gexgd0419/NaturalVoiceSAPIAdapter/releases)下载最新 Release（`NaturalVoiceSAPIAdapter_x86_x64.zip`）；
2. 解压程序文件夹至一个合适的位置；
    ::: warning
    语音库安装后，**此文件夹不得被移动、重命名或删除**，因为系统需要调用这里面的 DLL 文件。因此请确保解压到一个不会被自己清理的地方（例如 `C:\Program Files`）。
    :::
3. 运行程序根目录下的 `Installer.exe`，显示如下界面：
    ![image.png](https://s2.loli.net/2024/07/06/cmbvxeNlIHZ7FPR.png)
    ::: info “安装状态”信息
    界面会显示语音库的 32 位和 64 位版本是否已经安装，默认是“未安装”状态。
    - 32 位版本用于 32 位程序，64 位版本用于 64 位程序。
    - 64 位系统中，若希望所有程序（包括 32 位和 64 位程序）都能使用语音，则两个版本都要安装。**实测 Minecraft 只需要安装 64 位语音库即可。**
    - 32 位系统中，“64 位”一行不会显示。
    :::
    ::: info “语音枚举设定”信息
    界面还会显示语音枚举设定。
    - **讲述人自然语音**：支持的语言和语音较少，仅支持 Windows 10 部分版本和 Windows 11，**仅下载语音包需要联网，之后的合成均为离线合成**；
    - **Microsoft Edge 在线语音**：包括各种语言的丰富自然语音，支持 Windows XP-11 全版本，**不需要下载，但每一次合成都需要联网**。
    :::

## 步骤二：安装讲述人自然语音

::: tip 兼容性提示
讲述人自然语音仅支持 **Windows 10 (Build 17763 / 版本 1809 及以上) 和 Windows 11 全版本**。如果不满足版本要求或不希望安装讲述人自然语音，请跳到步骤三。
:::

4. 转到 [Narrator natural voice download links](https://github.com/gexgd0419/NaturalVoiceSAPIAdapter/wiki/Narrator-natural-voice-download-links) 页面，从中选取需要的自然语音引擎，通过 Link 跳转到 Microsoft Store，下载并安装；

## 步骤三：安装 `NaturalVoiceSAPIAdapter` 库

5. 在安装程序中，选择所需的语音枚举设定，点击“64 位”一行的“安装”按钮。如果弹出“用户账户控制”对话框，单击“是”，提示安装完成，如下图：
    ![image.png](https://s2.loli.net/2024/07/06/98EjbTHLzpVr4eX.png)

## 步骤四：设置 SAPI 的默认语音

6. 在键盘上按下 Windows 徽标键 + <kbd>R</kbd> 组合键，打开“运行”对话框；
7. 在“打开”文本框中，输入 `C:\Windows\System32\Speech\SpeechUX\sapi.cpl`（64 位）或 `C:\Windows\SysWOW64\Speech\SpeechUX\sapi.cpl`（32 位，注意和路径中的相反），单击“确定”；
8. 弹出“语音属性”对话框。点击“语音选择”下拉框，选择默认语音，如下图：
    ![image.png](https://s2.loli.net/2024/07/06/XCWoc63QSEMhanj.png)
    其中标有“Natural”字样的都是新安装的自然语音，有“Online”字样的都是 Microsoft Edge 在线语音。
9. 选择一个语音后，系统会自动播放预听语音。单击对话框底部的“应用”或“确定”按钮完成默认语音的设置。
10. 进入 Minecraft 享受全新的报站效果！
    ::: info
    由于报站语音是在客户端本地合成的，故在多人游戏的服务端配置语音没有用处，必须为每个客户端都进行配置。
    :::

## 局限性

### 延迟

较于其它系统自带语音，本文中的 SAPI 自然语音延迟较高，离线讲述人的音频可听见延迟达到了 152 毫秒，在线语音的延迟则更甚。有关详细信息，见[此链接](https://github.com/gexgd0419/NaturalVoiceSAPIAdapter/issues/1)。

不过在报站的使用场景下，此延迟带来的影响微乎其微。

### 部分 SAPI / SSML 功能缺失

这可能导致中/英报站不准确，以及部分词语的拼读问题。

详见 [Supported SAPI 5 Features](https://github.com/gexgd0419/NaturalVoiceSAPIAdapter/wiki/Supported-SAPI-5-Features)。
