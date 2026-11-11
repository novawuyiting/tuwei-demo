# 突围 TUWEI · 阅读训练 · 家庭试用版

一个用于家庭阅读练习的静态试用网页。原创英文短文，支持全文/单词/句子播放、语境释义和逐句翻译、麦克风录音、回听、下载、本机记录与家长演示视图。

## 试用说明

- 使用 Chrome 或 Safari 打开已发布的 HTTPS 网页，点击录音时允许麦克风。
- 三篇文章均提供四种完整英式/澳洲口音 MP3（Sonia、Ryan、Natasha、William），默认播放 Natasha 澳洲女声，可下载；单词、句子点读使用设备语音。
- 录音与学习记录只保存到使用者当前浏览器，没有上传接口、账号隔离或跨设备同步。
- 家长回看在同一浏览器内查看。家长在另一台设备上不能看到孩子的录音。
- 学生端已移除模拟自动标注和模拟 G 反馈，练习回顾仅汇总真实操作记录；尚不分析录音或生成能力评价。
- 清理浏览器数据可能清除记录；重要录音请先下载备份。
- 网站公开可访问，发布文件只包含原创示例文章、预置翻译、合成示范音频与程序，不包含任何使用者录音、真实成绩、密钥或私人 PRD。
- 合成音频用于流程体验，不代表 AEAS 官方材料或考试口音。

## GitHub Pages 发布

1. 把本目录下的 index.html、.nojekyll 和 README.md 放到仓库 main 分支根目录。
2. 打开仓库 Settings → Pages。
3. Build and deployment 中选择 Deploy from a branch，Branch 选择 main，目录选择 / (root)，保存。
4. 等待 GitHub 显示实际发布链接，再在家中 Wi-Fi 与移动网络实测加载和录音权限。

此版本不需要安装依赖或构建，不需要 API Key。ZIP 应解压后上传其中的文件，直接上传 ZIP 不会发布网页。

## 验证情况

JavaScript 语法、数据覆盖及关键逻辑检查通过；尚未由开发端完成真实浏览器截图、麦克风与触控测试。页面已由用户初步试用，正式家庭试用仍应检查录音、点读、保存与下载。

## 学习导航与进度

首页展示推荐阅读和本周目标；训练提供阅读、单词、小测试分类，后两者为即将开放。阅读列表区分未开始、进行中、已完成，可继续或主动重练。学习记录提供周进度和可翻阅的月历。默认每天一篇、每周三次；有真实录音且主动完成的非模拟训练计入进度，模拟流程不计打卡。完成时间使用 completedAt；早期记录缺少该字段时以创建时间回退。

## 阅读内容

- school-club-v1: A Different Kind of School Club，128 词，14 句，重点 different / similar / subject / describe，两道理解题。编辑源见 content/school-club.json；运行页面使用内嵌数据。
- garden-v1: A Garden for Everyone，保留旧录音关联，补充为两道理解题；旧单题答案兼容。
- 先读再查：朗读示范、词义与译文默认收起，重点词回顾仅在读后提供。

- camp-gorra-classroom-v1: Great fun at Camp Gorra!，课堂复习材料，163 词、7 句、两道补充理解题；来源未核实为 AEAS 官方试题。未发布原始课堂试卷或手写批注。
- 可用 `?article=camp-gorra-classroom-v1` 或 `?article=school-club-v1` 直达文章，保留既有本机记录。
- 新增两篇文章的全文 MP3 均由 Edge TTS 预生成并嵌入页面；不依赖设备安装澳洲语音。课堂 PDF 的听力题原始录音仍未提供，本次合成的是阅读文章示范。

## 2026-11-02：8 篇阅读

新增 A Small Performance, Growing Confidence；Finding the Right Dolphin Book；An Advantage for the Whole Team；The Owl in the Picture；A Presentation That Makes Sense。每篇约 131–153 词，配逐句翻译、完整语境词义、两道附依据的理解题和四种全文音频。

全部 32 段示范 MP3 现在放在 `audio/` 目录按需播放，部署时必须一起上传，不能只复制 index.html。示范音频公开；学生录音仍只在浏览器 IndexedDB，云端接入由另一个 thread 处理。

运行 `node tests/reading-library.test.cjs` 做数据与关键逻辑回归；不代表真实浏览器和麦克风验收。

## 课堂知识点复现

五篇新增文章复现课堂词汇，重点是语境词义、句子准确理解、-ance / -ence 词形和句段承接转折。理解题先选择答案、再选择原文依据，之后才显示反馈。读后可选一句话概括和折叠的词形／逻辑提示。

段落笔记保存在 session.paragraphNotes，原文依据保存在 session.evidenceAnswers，云端接入需要保留。没有自动语法或读音评分。所有文章均为原创训练素材，不公开老师反馈或孩子手写笔记。海豚资料参考 NOAA 与 Smithsonian，见对应 JSON 的 references。

## 2026-11-11 词表阅读补充

新增 5 篇原创练习，文章库共 13 篇。词汇选自《AEAS核心高频词汇》相关组别，结合双语例句册的语境学习方式；不是 AEAS 官方试题。每篇约 145–160 词，提供逐句翻译、完整词义、两道需选择原文依据的理解题、段落概括提示，以及澳洲／英式男女声的完整合成朗读。

| 文章 | 重点词 | 词表组别 |
| --- | --- | --- |
| A Survey with Missing Voices | survey, majority, count, representative | 38, 10, 39, 34 |
| One Bridge, Two Different Tests | experiment, evidence, approach, alternative | 20, 9, 21, 18 |
| A Repair Worth Making | quality, amount, economical, alternative | 28, 25, 17, 18 |
| Two Jobs in One Club | involve, suitable, personal, organisation | 12, 14, 15, 41 |
| A Sign People Could See | visible, position, significant, complete | 47, 42, 40, 13 |

文章数据同步至 student.html、parent.html、family-test.html，以及首页课程目录；既有文章 ID、页面交互及账号流程保持兼容。内容回归检查：`node tests/reading-library.test.cjs` 和 `node tests/article-catalog.test.cjs`。
