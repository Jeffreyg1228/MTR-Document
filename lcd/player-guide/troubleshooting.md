# 疑难解答

若在使用 LCD 的过程中发现任何 BUG，可按照如下步骤反馈：

1. 确保更新至 NTE 和 LCD 的最新版本，且使用 16A02 示例包能够复现问题；
2. 输入指令 `/mtrnte config` 打开 NTE 配置，将“显示 JS 调试信息”选项改为“是”；
3. 复现错误，截图一切错误信息；
4. 向 [jeffreyg1228@126.com](mailto:jeffreyg1228@126.com) 发送邮件反馈。请至少包含错误截图信息。如果必要，也请包含 Minecraft 日志。

## 已知问题

在最新版本的 LCD 测试中已发现下面的问题，但由于对 LCD 使用的影响较小，暂时不予修复。请勿反馈这些问题。

- 对于无限循环列车，到达起(终)点站后会短暂显示回库车提示；
- 列车回厂后 LCD 短暂冻结 5 秒，显示错误 `Wrapped java.lang.ArrayIndexOutOfBoundsException: Index 0 out of bounds for length 0 (mtr:shlcd/mtr_util.js#80)` ；
- 对于跨线运营列车，在到达一条线路的终点站时，只有左屏显示了下一线路信息，而色带及右屏还保留原来线路标志色。