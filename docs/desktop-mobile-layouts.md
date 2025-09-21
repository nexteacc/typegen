# 桌面端交互方案（现行）

## 概览
- 仅保留桌面端布局；移动端相关代码与交互已移除。
- 动画与转换链路：拖拽触发 Snap 动效 → 扫光动效 → API 调用 → 结果展示。

## 判定与结构
- 顶层页面：`app/page.tsx` 渲染 `DesktopLayout`。
- 共享控制器：`lib/use-transformer-controller.ts` 集中管理状态机与调用流程。

## 桌面专属（DesktopLayout）
- 入口形态：页面底部直接展示拖拽工具栏（保持原有 UI）。
- 触发方式：将滤镜图标拖拽到文本框触发转换（保持原有手势与高亮反馈）。
- 动画节奏：
  1) 文本框内出现滤镜 Snap 动效。
  2) 扫光（Light Sweep）动效。
  3) 发起 `/api/transform`，成功进入双栏对比；失败回到可重试状态。
- 相关文件：
  - `components/layout/DesktopLayout.tsx`（布局与拖拽区域）
  - `components/style-filter/*`（工具栏与图标组件、动画）

（移动端交互已移除，不再展示按钮/弹层。）

## 共享逻辑（控制器 Hook）
- 文件：`lib/use-transformer-controller.ts`
- 统一状态：
  - `text`、`originalText`、`state: TransformerState`、`selectedFilter`、`droppedFilter`、`isLightScanning`、`showResultActions`、`targetLength`、`isTextTooLong`。
- 统一动作：
  - 文本输入/就绪：`onTextChange`
  - 选择滤镜并启动转换：`onStartFilter`
  - 动画衔接：`onTextBoxSnapComplete` → `onLightSweepComplete`
  - 结果操作：`onCopyText`、`onTryOtherStyle`、`onRestart`
  - 桌面拖拽：`onDragOver`、`onDragLeave`、`onDrop`（仅 DesktopLayout 使用）

## 文案与多语言
仅使用原桌面端相关提示文案（如 `dragFilterHint`）。

## 验证与注意事项
- 尺寸验证：≥1024 宽度下验证拖拽交互与动画；小屏相关交互不再提供。
- 动画一致性：Snap 与扫光动效流程如上；API 失败回退与重试流程一致。
