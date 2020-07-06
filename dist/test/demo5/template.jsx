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
//# sourceMappingURL=template.jsx.map