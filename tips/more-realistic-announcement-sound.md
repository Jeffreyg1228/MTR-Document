# 在 MTR 模组中获取更自然的报站语音

MTR 模组的“报站声音不真实”历来受玩家吐槽。事实上，这真不是 Jonathan 的锅——MTR 模组只是调用了 Minecraft 自带的语音合成库 (`com.mojang.text2speech`)。

在 Windows 上，Minecraft 调用 SAPI (microsoft Speech API) 进行语音合成。因此，可以通过安装一个比较自然的、使用 SAPI 的语音合成引擎来解决这一问题。

::: details 拓展阅读
[About different Microsoft speech systems (英文)][1]，简要介绍了 Windows 的各种语音合成 API。
:::

## NaturalVoiceSAPIAdapter 介绍

[NaturalVoiceSAPIAdapter](https://gitee.com/gexgd0419/NaturalVoiceSAPIAdapter) 是一个连接 [Azure AI 语音服务][2]，使第三方程序也能使用微软[自然语音][3]的 [SAPI 5 TTS 引擎][4]。

该库的作者提取了 Windows 内置的语音合成密钥，因此这些需要付费的语音合成 API 可被我们免费调用。

::: info
项目包含 [GitHub][5] 和 [Gitee][6] 两个仓库。为方便国内读者，本文的所有链接都指向其 Gitee 仓库。
:::

## API 类型的选择

NaturalVoiceSAPIAdapter 库支持三种语音合成 API 类型：

- Windows 11 中的讲述人自然语音
- Microsoft Edge 中“大声朗读”功能的在线自然语音
- 来自 Azure AI 语音服务的在线自然语音，只要你有对应的 key

本人更推荐**讲述人自然语音**。这三种 API 的比较如下表：

|                      | 讲述人自然语音 (推荐) | Edge 在线语音     | Azure 在线语音    |
| -------------------- | --------------------- | ----------------- | ----------------- |
| 系统要求 ([详情][7]) | Windows 7 及以上      | Windows XP 及以上 | Windows XP 及以上 |
| 支持的语言和语音数量 | 较少 ([详情][8])      | 多                | 多                |
| 是否需要下载         | ✔️                    | ❌                | ❌                |
| 合成时是否需要网络   | ❌                    | ✔️                | ✔️                |
| 是否免费             | ✔️                    | ✔️                | ❌                |
| 是否合规             | ❌                    | ❌                | ✔️                |
| 综合稳定性           | 较高                  | 较低                | 中等              |

## 安装 NaturalVoiceSAPIAdapter

- 如果需要，请先[安装讲述人自然语音][8]；
- 随后，[安装语音库][9]。至少安装 32 位语音库。

::: warning
解压程序并安装语音库后，**其文件夹不得被移动、重命名或删除**，因为系统需要调用这里面的 DLL 文件。因此请确保解压到一个不会被自己清理的地方（例如 `C:\Program Files`）。

若要移动或删除该文件夹，应先卸载语音库。
:::

## 设置 SAPI 的默认语音

Minecraft 调用 SAPI 的默认语音进行合成，因此必须设置默认语音才能生效。

1. 在键盘上按下 <kbd>Windows 徽标</kbd> + <kbd>R</kbd> 组合键，打开“运行”对话框；
2. 在“打开”文本框中，输入 `C:\Windows\SysWOW64\Speech\SpeechUX\sapi.cpl`；
3. 单击“确定”，弹出“语音属性”对话框。点击“语音选择”下拉框，选择默认语音，如下图：
   ![image.png](https://s2.loli.net/2024/07/06/XCWoc63QSEMhanj.png)
   其中标有“Natural”字样的都是讲述人自然语音，有“Online”字样的都是 Edge 在线语音。
4. 选择一个语音后，系统会自动播放预听语音。单击对话框底部的“应用”或“确定”按钮完成默认语音的设置。
   ::: info
   如果安装了 64 位语音库，需要重复上面步骤，把路径换成 `C:\Windows\System32\Speech\SpeechUX\sapi.cpl`。
   
   是的你没看错，64 位语音库使用的路径中包含“32”，反之亦然。
   :::
5. 完成！启动 Minecraft，点击 _Minecraft 首页 -> 选项… -> 辅助功能设置… -> 复述功能_ 即可测试。

## 局限性

### 部署麻烦

由于报站语音是在客户端本地合成的，故在多人游戏的服务端配置语音没有用处，必须为每个客户端都进行配置。

### 延迟

较于其它系统自带语音，本文中的 SAPI 自然语音延迟较高，离线讲述人的音频可听见延迟达到了 152 毫秒，在线语音的延迟则更甚。有关详细信息，见[此链接](https://github.com/gexgd0419/NaturalVoiceSAPIAdapter/issues/1)。

不过在报站的使用场景下，此延迟带来的影响微乎其微。

[1]: https://gitee.com/gexgd0419/NaturalVoiceSAPIAdapter/wikis/About-different-Microsoft-speech-systems
[2]: https://learn.microsoft.com/azure/ai-services/speech-service/
[3]: https://speech.microsoft.com/portal/voicegallery
[4]: https://learn.microsoft.com/en-us/previous-versions/windows/desktop/ms717037(v=vs.85)
[5]: https://github.com/gexgd0419/NaturalVoiceSAPIAdapter
[6]: https://gitee.com/gexgd0419/NaturalVoiceSAPIAdapter
[7]: https://gitee.com/gexgd0419/NaturalVoiceSAPIAdapter#%E7%B3%BB%E7%BB%9F%E8%A6%81%E6%B1%82
[8]: https://gitee.com/gexgd0419/NaturalVoiceSAPIAdapter/wikis/%E8%AE%B2%E8%BF%B0%E4%BA%BA%E8%87%AA%E7%84%B6%E8%AF%AD%E9%9F%B3%E4%B8%8B%E8%BD%BD%E9%93%BE%E6%8E%A5?
[9]: https://gitee.com/gexgd0419/NaturalVoiceSAPIAdapter#%E5%AE%89%E8%A3%85
