# Collection Status

## 2026-05-15

- 项目定位已调整为 Seedance 2.0 prompt case library。
- 当前共有 71 条正式案例：42 条来自飞书文档，29 条来自 MIT GitHub prompt 集合。
- 每条案例都包含完整 prompt、来源平台、来源链接、作者信息和本地封面图。
- 已加入 AI 生成的视频感 PNG 封面，前端用 16:9 封面图模拟视频卡片，并叠加播放按钮、时长和来源角标。
- `media/covers/*.svg` 作为兜底封面保留，后续新增案例没有 AI 封面时仍可正常展示。
- 原始视频不作为当前收录门槛。后续仅在来源允许下载或再分发时补充到 `media/outputs/`。

## Source Gate

正式入库必须满足：

1. 有完整可复制 prompt。
2. 有可访问来源链接。
3. 能标记来源平台和作者。
4. 封面来源明确，或使用 `coverStatus: ai-generated`、`coverStatus: ai-category`、`coverStatus: generated` 标记。

## 下一步

1. 继续优先采集 GitHub、公开网页和可复核搜索结果中的完整 prompt。
2. 对 X 和小红书内容使用登录浏览器单独采集，并只收有原始来源的案例。
3. 对新增案例做 URL、prompt 文本和标题/作者组合去重。
4. 如来源允许，补充真实封面截图或原始视频，并更新 `coverStatus` 与 `output.status`。
