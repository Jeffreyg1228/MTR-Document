# 疑难解答

在测试中发现了一些问题，下面是针对性的解决方案。

在进行下面的步骤前，请先**输入指令 `/mtrnte config` 打开 NTE 配置，将“显示 JS 调试信息”选项改为“是”。**

## 1. 列车的 LCD 没有显示 / 没有及时更新。

如果遇到“NTE 资源加载过程中发生错误”屏幕：
- 使用[热修复资源包](https://jeffreyg1228.lanzv.com/iGpCH1mtw8cf)替换原资源包，看能否解决问题；
- 如果不能，请向 [jeffreyg1228@126.com](mailto:jeffreyg1228@126.com) 发送邮件反馈。请至少包含错误截图信息。

请先检查您是否正确配置了 LCD。示例列车 16A02 已经正确配置。

随后，查看左上角是否有对应列车的 JS 脚本执行信息。

- **有，且包含红色错误信息**：等待 30 秒，如果错误信息没有消失，可截图进行反馈。
- **有，且旁边的毫秒数不动**：等待列车进站开门，如果毫秒数还是不动，按照以下步骤进行。
- **无**：按照以下步骤进行。

一般步骤：

- 确保打开了“显示 JS 调试信息”选项，步骤见本文开头；
- 强制下车，并传送到离列车足够远的位置，迫使 LCD 重载；
- 在铁路仪表板中点击“清除列车”；
- 在车站等待列车自行驶来，手动驾驶可能会有问题。
