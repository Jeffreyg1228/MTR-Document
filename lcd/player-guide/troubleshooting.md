# 疑难解答

## 已知问题

在最新版本的 LCD 测试中已发现下面的问题，但由于对 LCD 使用的影响较小，暂时不予修复。请勿反馈这些问题。

- 对于无限循环列车，到达起(终)点站后会短暂显示回库车提示；
- 列车回厂后 LCD 短暂冻结 5 秒，显示错误 `Wrapped java.lang.ArrayIndexOutOfBoundsException: Index 0 out of bounds for length 0 (mtr:shlcd/mtr_util.js#80)` ；
- 对于跨线运营列车，在到达一条线路的终点站时，只有左屏显示了下一线路信息，而色带及右屏还保留原来线路标志色。