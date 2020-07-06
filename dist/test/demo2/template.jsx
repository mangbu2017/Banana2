"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// 基本就是主站业务最复杂场景了
var plantTemplate = function (item) {
    return <template>
        <p class="baseinfo">{item.region}{item.reion !== item.subRegion ? "-" + item.subRegion : ''}</p>
        <p class="baseinfo">{item.addr}</p>
        {item.jingjiren !== "" &&
        <p class="baseinfo last">
                <i class="managerIcon"></i><span class="manager">{item.jingjiren}</span><span class="managerCompany">{item.company}</span>
            </p>}
    </template>;
};
var othersTemplate = function (item, type) {
    return <template>
        <p class="baseinfo">
            <span class="withI">
                {item.region}
                {item.reion !== item.subRegion ? "-" + item.subRegion : ''}
            </span>
            {item.addr !== "" && <template>
                    <i class="split"></i>
                    <span class="withI">{item.addr}</span>
                </template>}
            <i class="split"></i>
            <span>{type === 'office' ? item.gongweishu : item.spJingYingState}</span>
        </p>
        <p class="baseinfo">{item.objectType}&nbsp;{item.cengshu}</p>
        {item.jingjiren !== "" && <p class="baseinfo last">
                <i class="managerIcon"></i>
                <span class="manager">{item.jingjiren}</span>
                <span class="managerCompany">{item.company}</span>
            </p>}
        <p class="tag-wrap">
            {item.tags.map(function (_a, index) {
        var title = _a.title;
        return <span class={"tag-" + (index + 1)}>{title}</span>;
    })}
        </p>
    </template>;
};
var listTemplate = function (_a) {
    var list = _a.list, type = _a.type;
    try {
        return <template> {list.map(function (item) {
            console.log('item: ', item);
            var mianyi = item.firstPrice === '面议' && item.secondPrice === '', plant = type === 'plant';
            return <li logr={item.logr}>
                        <div class="pic">
                            <a href={item.jumpUrl} target="_blank" onclick={"clickLog(" + item.clickLog + ")"}>
                                <img src={item.picUrl}/>
                                {item.quanjing && <i class="VRIcon"></i>}
                                {item.shipin && <i class={""}></i>}
                            </a>
                            {item.picCount > 1 && <span class='picNum'>{item.picCount}图</span>}
                        </div>
                        <h2 class='title'>
                            <a href={item.jumpUrl} tongji_label="listclick" target="_blank" onclick={"clickLog('from=" + item.clickLog + "detail@posttype=$postType')"}>
                                <span class="title_des">{item.title}</span>
                            </a>
                        </h2>
                        <div class={"list-info " + (item.jingjiren === "" ? 'intro_sty_2' : '')}>{plant ? plantTemplate(item) : othersTemplate(item, type)}</div>
                        <div class={"price " + (mianyi ? 'mianyi' : '')}>
                            <p class="up">
                                <span class="num">{item.firstPrice}</span>
                                <span class="unit">{item.firstPriceUnit}</span>
                            </p>
                            {!mianyi && <p class="down">{item.secondPrice}{item.secondPriceUnit}</p>}
                        </div>
                        {item.area2 && <div class="area">
                            <p class="num">
                                <span>{item.area2}</span>
                                <span class="unit">㎡</span>
                            </p>
                            <p class="down">建筑面积</p>
                        </div>}
                    </li>;
        })}
        </template>;
    }
    catch (err) {
        console.log('listTemplate.error: ', err);
    }
};
var render = function (args) { return <template>
    <h1>为您推荐其他热门房源</h1>
    <ul class="list-main-style">{listTemplate(args)}</ul>
</template>; };
window.onload = function () {
    console.log('render: ', render);
    var ht = render({ type: "shangpu", list: res.list });
    console.log(ht);
    var oDiv = document.getElementsByTagName('div')[0];
    oDiv.innerHTML = ht;
};
exports.ListRender = render;
//# sourceMappingURL=template.jsx.map