# 移植到 BlockBench 列车

## 前置要求 {#requirements}

- 一个 MTR 列车追加包，列车模型使用 BlockBench 构建；
- 一台安装了 [BlockBench](https://www.blockbench.net/downloads) 软件的电脑。
    ::: info BlockBench 兼容性信息
    - 对于 **Windows 7、Windows 8、Windows 8.1 和 Windows 10 (32 位) 电脑**，请安装 [BlockBench 4.6.5 版本](https://www.blockbench.net/downloads#v4.6.5)。
    - 对于兼容的电脑，建议使用软件的最新版本。本教程将使用 BlockBench 4.10.4 版本。
    :::

## 步骤一：准备资源包 {#prepare-resource-pack}

1. 前往 [MTRBBS 发布帖](https://www.mtrbbs.top/thread-5656-1-1.html) 下载最新版本的 LCD **适配包**。
2. 适配包内部应该只有一个 `shlcd` 文件夹，将其解压到要安装 LCD 的资源包的 `assets\mtr` 文件夹内。最终的文件结构可参考下图（示例包的文件结构）：
    ```
    shLCD-16A02-adaptation-test.zip
    │  pack.mcmeta
    │  pack.png
    │
    └─ assets
        └─ mtr
            │  mtr_custom_resources.json
            │  sounds.json
            │
            ├─ 16a02
            │      16a02.bbmodel
            │      16a02.json
            │      16a02_d.png
            │      16a02_e.png
            │      16a02_n.png
            │      slots.json
            │
            ├─ shlcd // [!code highlight]
            │  │  config.json
            │  │  draw.js
            │  │  font_util.js
            │  │  js_util.js
            │  │  lang.js
            │  │  main.js
            │  │  mtr_util.js
            │  │
            │  └─fonts
            │      └─……
            │
            └─sounds
                └─……
    ```
3. 在资源包的 `assets\mtr` 文件夹内，编辑 `mtr_custom_resources.json`：
    ```json:line-numbers
    {
        "custom_trains": {
            "16a02_n": {
                "base_train_type": "base_24_2",
                "name": "[LCD] 上海地铁16号线-16A02抹茶二世-普通车",
                "color": "8ed1c0",
                "script_texts": [ "include(Resources.id(\"mtrsteamloco:scripts/display_helper.js\"));",// [!code ++]
                    "var slotCfg = JSON.parse(Resources.readString(Resources.id(\"mtr:16a02/slots.json\")));",// [!code ++]
                    "var dhBase = new DisplayHelper(slotCfg);" ],// [!code ++]
                "script_files": [ "mtr:shlcd/main.js" ],// [!code ++]
                "texture_id": "mtr:16a02/16a02_n",
                "model": "mtr:16a02/16a02.bbmodel",
                "model_properties": "mtr:16a02/16a02.json"
            },
            ...
        }
    }
    ```
    - **对于每个需要安装 LCD 的列车**，增加 `script_texts` 字段：原样复制上方第 7-9 行内容，**随后把第 8 行中的 `mtr:16a02` 改为列车 `model` 字段对应的命名空间 ID**。例如，`model` 字段的值为 `mtr:foo/bar.bbmodel`，那么第 8 行为 `"var slotCfg = JSON.parse(Resources.readString(Resources.id(\"mtr:foo/slots.json\")));",`。
        ::: info 技术信息
        NTE 通过给出坐标的形式来指定动态显示屏的设置位置。这是为了使得设置更为灵活，以便便利地增加到已有模型的车辆上，同时这也和 RTM 的方向幕设定较为类似。把它称为**槽位**（slot）。

        这一步操作的目的是使多个列车模型读取它们各自的槽位。`script_texts` 数组里的内容为 JavaScript 源代码，会在 `script_files` 之前运行，详见 [NTE 文档](https://www.zbx1425.cn/nautilus/mtr-nte/#/js-train?id=%e6%b7%bb%e5%8a%a0%e8%bd%a6%e5%9e%8b)。这里是读取模型所在目录的槽位文件 `slots.json`，并以此初始化 `DisplayHelper`。
        :::
    - **对于每个需要安装 LCD 的列车**，增加 `script_files` 字段：原样复制上方第 10 行内容即可。
        ::: warning
        如果您的资源包对 LCD 内部的 JS 代码作了修改，为避免多资源包叠加导致的错误，请把第 10 行的 `shlcd` 改为其它名称，别忘了更改 LCD 文件夹的名称。
        :::
4. **对于上述列车使用的每个 `.bbmodel` 文件**，在其所在的文件夹下创建一个空文件，名为 `slots.json`，第 17 步将用到。例如，`model` 字段的值为 `mtr:foo/bar.bbmodel`，那么在资源包的 `assets\mtr\foo` 下创建该文件。
    ::: warning
    本教程假设同一文件夹下只存在一个 `.bbmodel` 文件。
    :::

## 步骤二：修建参考方块 {#build-reference-blocks}

5. 在 BlockBench 中打开需要安装 LCD 列车的 `.bbmodel` 文件。在模型中需要放置 LCD 的地方，修建一个方块（cube），我们称其为**参考方块**。参考方块的各种位置属性，例如坐标、尺寸、旋转角度等都与 LCD 最终的显示吻合。为避免绘制错误，规定参考方块的 **Y 轴尺寸值必须为 0**，且 X 轴、Z 轴尺寸值不为 0。
    ::: tip 参考方块的修建位置和推荐命名（假定需要修建在门上方）
    - **对于一节车厢完整建模的列车**：应该包含多个门，可任意选择。推荐在中间两侧门的上方各修建一个参考方块。相对于模型的车头方向，命名左侧门上的为 `LCD_L`，右侧门上的为 `LCD_R`。
    - **对于部分建模的列车，但建模了双侧门**：推荐在两侧门的上方各修建一个参考方块。相对于模型的车头方向，命名左侧门上的为 `LCD_L`，右侧门上的为 `LCD_R`。
    - **对于部分建模的列车，且只建模了一侧门**（例如示例包 16A02 列车）：就在该门上方修建参考方块，命名为 `LCD_L` 或 `LCD_R`（取决于相对于模型的车头方向，LCD 处于左侧门还是右侧门）。
    :::
    ::: info 深入理解
    参考方块实质上是为了直观调整、方便获取 LCD 的显示位置，它本身的外观及存在与否等不影响 LCD 的显示。因此对于那些已经修建了一个“黑屏”贴图的列车模型来说，参考方块的贴图推荐是透明，且在获取完准确坐标之后可以删除参考方块。
    :::
6. **选中**每个参考方块，在右侧找到“元素”面板，如下图。**点击“枢轴居中”按钮**（图中红框）。可能会看到坐标的改变。
    <Image src="https://s2.loli.net/2024/07/07/CwtsxY9zH8ckr7h.png"/>
7. **保存模型文件**。
    ::: details
    点击 BlockBench 左上角菜单：*文件 → 保存项目*（如下图），或按下 <kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>S</kbd> 快捷键。
    <Image src="https://s2.loli.net/2024/07/07/8gdiW1Q5wkXvCYP.png"/>
    :::

## 步骤三：记录模型信息 {#model-properties}

8. **判断列车模型的正方向**。列车的正方向有 Z+ 和 Z- 之分。在 BlockBench 中，从车尾往建模的车头方向，如果各方块的 Z 坐标递增，则正方向为 Z+；反之则正方向为 Z-。在第 11 步中要用到。
9. **`offsets`（偏移量）的获取**。即相对于参考方块所在的 LCD 位置来说，其它 LCD 与它在 X 轴、Y 轴、Z 轴上的偏移量。参见 [NTE 文档](https://www.zbx1425.cn/nautilus/mtr-nte/#/js-display-helper?id=%e6%98%be%e7%a4%ba%e5%b1%8f%e4%bd%8d%e7%bd%ae%e9%85%8d%e7%bd%ae)。在第 15 步中要用到。具体来说，我们关心下列属性：
    - 一节车厢有多少个 LCD；
    - 参考方块对应的 LCD 在车厢的哪个位置（是靠车头、靠车尾还是中间？中间第几个？）
    - 相邻 LCD 之间的距离（见下方提示 1）。
    ::: tip
    1. 在一个标准的 BlockBench 列车模型中，每一侧 LCD 应该只有 Z 轴的偏移量，而 X 轴、Y 轴上的偏移量均为 0。这里 Z 轴的偏移量，也就是相邻 LCD 之间的距离，可以通过 `(同侧相邻门之间的车厢长度 + 一个门的长度) ÷ 16` 来获取。如下图。
    <Image src="https://s2.loli.net/2024/07/20/juqvspRKgF1HayI.png" />
    2. LCD 在每个车厢的渲染位置都是一模一样的，因此无需考虑车厢之间的距离。跨车厢 LCD 是不可行的。
    :::

## 步骤四：使用 LCD 适配工具 {#use-lcd-adaptation-tool}

10. 前往 [MTRBBS 发布帖](https://www.mtrbbs.top/thread-5656-1-1.html) 下载最新版本的 LCD **适配工具**，并双击运行它。
    ::: details 无法运行？
    请确保安装了 JDK 17。可[点击此处](https://download.oracle.com/java/17/latest/jdk-17_windows-x64_bin.exe)下载 JDK 17 的 Windows 版本安装程序。
    :::
11. 在程序主界面，点击左上角菜单：*文件 → 加载 BBMODEL 文件*。弹出“配置 BlockBench 模型”对话框，如下图。
    <Image src="https://s2.loli.net/2024/07/20/XGrB3qRhv5ISsLQ.png" />
    - **模型路径**是 `.bbmodel` 文件的位置，可通过“浏览…”按钮选取，也可直接输入。例如 `D:\shLCD-16A02-adaptation-test\assets\mtr\16a02\16a02.bbmodel`。
    - **车头方向**是第 8 步判断的模型的正方向，通过下拉框选取是“Z+”还是“Z-”。
12. 点击“确定”按钮，显示的界面如下图所示。
    <Image src="https://s2.loli.net/2024/07/21/8hiOQvqZJ59BEH4.png" />
    其中：
    我们把整个工作流分为三个部分：（不想看可跳到下一步）
    - **选定 LCD 参考方块**。界面左侧的树状图显示模型结构，它和 BlockBench 中的“大纲”一致。顶部是一个搜索框，可选择是搜索方块名称（name）还是其 UUID。底部显示已经选定的参考方块名称及其 UUID。  
    可以通过双击参考方块，或右键点击“选择”菜单项的方式，来选定一个参考方块。同样，**可以通过再次双击，或右键点击“取消选择”菜单项的方式，取消选择已选定的参考方块**。右键点击任意方块，将显示“详细信息”菜单项，可用来查看方块的所有 JSON 属性。
    - **进行配置**。选定一个参考方块后，右侧上半部分的文本域内会显示它的所有位置信息。
    - **获取结果**。点击“生成配置(G)”按钮后，右侧下半部分的文本域内会生成该模型的槽位配置。
13. 在界面左侧的搜索框中，输入参考方块的名称，例如 `LCD_L`，如下图。
    <Image src="https://s2.loli.net/2024/07/21/1TFxZdUfCWSrilb.png" />
    双击搜索出来的方块，弹出“选定 LCD 参考方块”对话框，如下图。
    ::: tip
    双击时光标应处于方块名称上，处于名称外无法触发。右键菜单同理。
    :::
    <Image src="https://s2.loli.net/2024/07/21/TKv9DdNLVURIJzS.png" />
    其中：
    - **LCD 位置**是指，该参考方块代表的 LCD 相对于模型的车头方向，处于左侧门还是右侧门，可通过下拉框选择。
    - **生成对侧 LCD** 是一个复选框，如果存在对门的参考方块就无需勾选，否则需要勾选。例如，对于示例包的 16A02 列车，则需要勾选，因为只在一侧门上修建了参考方块。
    ::: info 选错方块 / LCD 位置选错 / 忘记勾选“生成对侧 LCD”？
    在界面左下角“已选定的参考方块”中，可以看到已选定方块的名称和 UUID。在搜索框输入方块的名称，然后双击双击搜索出来的方块，即可取消选择。
    :::
14. 点击“确定”按钮，显示的界面如下图所示。
    <Image src="https://s2.loli.net/2024/07/21/uYk7naA8Uj13pRD.png" />
    ::: danger 遇到错误？
    错误 1：[无法选择 xxx 作为参考方块 - 参考方块的 X 轴、Y 轴、Z 轴尺寸值中必须有一值为 0。/ 参考方块对角顶点的 Y 坐标不相等。很抱歉，LCD Adaptation Tool 还没有适配此情况。](#lat-error-1)
    
    错误 2：[无法选择 xxx 作为参考方块 - 已存在两侧的参考方块。](#lat-error-2)
    :::
    对于存在两个参考方块的列车（没有勾选“生成对侧 LCD”），请**重复第 13-14 步**，添加对侧门的参考方块，例如 `LCD_R`。
15. 在界面右上角，点击“管理同侧 LCD…”按钮，弹出“配置同侧 LCD”对话框，如下图。
    <Image src="https://s2.loli.net/2024/07/20/tBE3vhwCgqN62Oa.png" />
    默认添加了一个 `(0, 0, 0)`，它代表参考方块位置的 LCD。根据第 9 步的准备，对于同侧的每个 LCD，点击“添加 LCD”按钮，在弹出的对话框中，我们可以输入其 X、Y、Z 轴偏移量。
    ::: tip
    1. 在一个标准的 BlockBench 列车模型中，每一侧 LCD 应该只有 Z 轴的偏移量，而 X 轴、Y 轴上的偏移量均为 0。
    2. 实际移植中很可能不清楚参考方块对应的 LCD 在车厢的哪个位置。这时可以只保留一个 `(0,0,0)` 的 LCD，直接点击“确定”，生成配置后在游戏中观察。
    3. 例如，对于下图的车厢结构，应该 5 次点击“添加 LCD”按钮，在弹出对话框中，分别把“Z 偏移量”从 0 改为 -15、-10、-5、5、10。
    <Image src="https://s2.loli.net/2024/07/20/juqvspRKgF1HayI.png" />
    :::
16. 点击“确定”按钮，“进行配置”文本域中会显示更新的 `offsets` 信息。点击下面的“生成配置(G)”按钮，在“获取结果”文本域中将生成该模型的槽位配置。
    ::: danger 遇到错误？
    错误 3：[无法生成配置 - 未完整配置两侧的参考方块。](#lat-error-3)

    错误 4：[无法生成配置 - offsets 不能为空。请通过“管理同侧 LCD”按钮添加 offset。](#lat-error-4)

    错误 5：[部分 LCD 的坐标合法性验证未通过！](#lat-error-5)
    :::
17. 点击“复制结果(C)”按钮，将复制的槽位配置粘贴入第 4 步创建的 `slots.json` 中即可。
18. 压缩并加载新的资源包，在 Minecraft 中享受 LCD 列车体验！

## 疑难解答 {#troubleshooting}

### 1. LCD 适配工具的常见错误提示 {#lat-errors}

#### 1) 无法选择 xxx 作为参考方块 - 参考方块的 X 轴、Y 轴、Z 轴尺寸值中必须有一值为 0。/ 参考方块对角顶点的 Y 坐标不相等。很抱歉，LCD Adaptation Tool 还没有适配此情况。{#lat-error-1}

根据步骤 5，规定参考方块的 **Y 轴尺寸值必须为 0**。请在 BlockBench 中再次检查参考方块是否符合该要求。检查的方法如下：
1. 打开模型文件，选中参考方块；
2. 查看界面右上角“元素”面板；
3. 在“尺寸”字样下面一行应该有 4 个数字。
    - 如果将第 2 个数字不为 0，将其改为 0，并确保第 1、第 3 个数字不为 0。然后调整参考方块的位置。完成后，别忘了保存模型文件。
    - 如果第 2 个数字为 0，且第 1、第 3 个数字不为 0，可能是在适配工具中选择了错误的方块才导致此错误。

#### 2) 无法选择 xxx 作为参考方块 - 已存在两侧的参考方块。{#lat-error-2}

这是由于已经选定了两侧的参考方块，或者选定了一侧参考方块并勾选了“生成对侧 LCD”。

如果选错参考方块，可以在界面左下角“已选定的参考方块”中，可以看到已选定方块的名称和 UUID。在搜索框输入方块的名称，然后双击搜索出来的方块，即可取消选择。

#### 3) 无法生成配置 - 未完整配置两侧的参考方块。{#lat-error-3}

请确保执行了第 13-14 步。

对于存在两个参考方块的列车（没有勾选“生成对侧 LCD”），请**重复第 13-14 步两次**，保证添加了两侧门的参考方块。

#### 4) 无法生成配置 - offsets 不能为空。请通过“管理同侧 LCD”按钮添加 offset。{#lat-error-4}

请确保执行了第 15 步。

#### 5) 部分 LCD 的坐标合法性验证未通过！{#lat-error-5}

适配工具在计算 LCD 各个顶点的坐标后会进行自动检查，以确保槽位配置的坐标合法（详见 [NTE 文档](https://www.zbx1425.cn/nautilus/mtr-nte/#/js-display-helper?id=%e6%98%be%e7%a4%ba%e5%b1%8f%e4%bd%8d%e7%bd%ae%e9%85%8d%e7%bd%ae)）。出现这个警告说明 LCD 的坐标可能不合法，这将导致 LCD 不显示。下面的排错步骤可供参考：

1. 点击适配工具的“排错助手…”按钮，弹出“排错助手”对话框；
2. 在浏览器中打开 [GeoGebra 3D 计算器](https://www.geogebra.org/3d)，点击右上角齿轮图标，在菜单中点击“设置”，勾选“y 轴竖直向上”；
3. 对于“验证状态”为未通过的 LCD，将其“旋转后的各顶点坐标”下的四个顶点表达式，逐行复制到 GeoGebra 左侧的输入框中，每行一个；
    ::: info
    为便于观察，“排错助手”中显示的 X 轴坐标均为相反数。可在“进行配置”下的文本域中找到真实的坐标。
    :::
4. 根据它的倾斜方向确认其正面，然后确认 A、B、C、D 四点是否分别位于左上、左下、右下、右上。如果不是，恭喜你发现了问题所在！下图便是错误坐标的一个典型例子。
    <Image src="https://s2.loli.net/2024/07/20/DYj6lKn9xA2rtEa.jpg" />
    此时需要明确坐标应该如何交换：A ↔ C，B ↔ D。随后打开 `slots.json`，把对应 LCD 的第 1、3 和第 2、4 个坐标数组分别交换即可。
    ::: info 注意
    左侧门的参考方块 `name` 不一定是 `lcd_door_left`，请通过“排错助手”中相应 LCD“在配置中对应的位置”一项确定。
    :::

也可点击“编辑 LCD 属性…”按钮，把左侧和右侧的 LCD 的一些诸如 ±180°、±360° 的角度改成 0°（如果有）。重新生成配置，看看能否解决问题。

### 2. LCD 不显示。{#lcd-does-not-display}

请确认在生成配置时没有遇到“部分 LCD 的坐标合法性验证未通过！”错误提示，如果有，按照[上面的解决方案](#lat-error-5)处理。

另一种 LCD 不显示的原因可能是，LCD 渲染在了不正确的位置，例如卡在车厢里面。解决方案如下：

1. 点击适配工具的“微调…”按钮，在弹出的对话框中，把“Y 偏移量”（高度）设为一个较大的值，例如 10；
2. 重新生成配置并编辑 `slots.json`，然后压缩并替换原来的资源包，进入游戏，按 <kbd>F3</kbd> + <kbd>T</kbd> 快捷键重载资源包。
3. 如果 LCD 在列车上方较高的位置渲染出来，想象其降低高度后是否与预期的位置重合。如果近似重合，则基本可以认定 LCD 卡在了车厢内部。
4. 编辑 `slots.json`，将发生这种情况的一侧 LCD 的 `offsets` 中的所有 X 偏移量设为一个较小的值，如 ±0.1 或 ±0.01 等（正负号如何取须自行尝试）。

### 3. LCD 与黑色贴图重合（如下图）。{#lcd-display-issue}

<Image src="https://s2.loli.net/2024/07/09/vqg49x6kIMjBXhA.png"/>

原因是 LCD 正好在参考方块处渲染。编辑 `slots.json`，将发生这种情况的一侧 LCD 的 `offsets` 中的所有 X 偏移量设为一个较小的值，如 ±0.01 等（正负号如何取须自行尝试）。

### 4. LCD 的显示字体过小（如下图）。{#lcd-ppb-issue}

<Image src="https://s2.loli.net/2024/07/21/UAmCes5H9OQTKNG.png"/>

我们定义一个数值 **PPB**（Pixels Per Block），用于指定 Minecraft 中的 1 个方块大小渲染多少像素的 LCD。这种情况通常是由于 PPB 取值过大引起的。下面是 PPB 取不同值时 LCD 的显示效果：

| PPB | LCD 显示                                                          |
|-----|-------------------------------------------------------------------|
| 50  | <Image src="https://s2.loli.net/2024/07/21/st4iwmo9eudQaDN.png"/> |
| 94  | <Image src="https://s2.loli.net/2024/07/21/Wi5BhGMSgzlZ71r.png"/> |
| 200 | <Image src="https://s2.loli.net/2024/07/21/UAmCes5H9OQTKNG.png"/> |

适配工具中，PPB 的默认值是 50。在生成配置时，如果默认值导致竖直方向的像素过少，适配工具会自动增加该值。示例包 16A02 列车就是这样。

在某些列车中，可能 PPB 即使取默认值 50 也会导致竖直方向的像素过多，导致最终显示的字体过小。这时候可以手动调节 PPB，方法如下：

1. 点击适配工具的“编辑 LCD 属性…”按钮，在弹出的对话框中，将左侧和右侧的 LCD 的“PPB 数值”从默认值 50 改为一个较小的值，但是要大于 0；
2. 点击“确定”按钮关闭对话框，再点击“生成配置(G)”。
3. 在生成的配置中，查找任意 LCD 的 `texArea` 属性。这是一个数组，观察它的后两个数字，如果一个近似于 `1617`，另一个近似于 `280`（可以比这些值稍大），则这样的显示尺寸最适宜。否则继续调整 PPB 直到符合该要求。

## 鸣谢 {#acknowledgements}

感谢 [Folanoel 大佬的教程](https://www.bilibili.com/opus/892267751993769985)！