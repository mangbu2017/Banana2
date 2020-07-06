const plantTemplate = (item) =>
    <template>
        <p class="baseinfo">{ item.region }{ item.reion !== item.subRegion ? `-${item.subRegion}` : ''}</p>
        <p class="baseinfo">{ item.addr }</p>
        {
            item.jingjiren !== "" && item.fuck &&
            <p class="baseinfo last">
                <i class="managerIcon"></i>
                <span class="manager">{item.jingjiren}</span>
                <span class="managerCompany">{ item.company }</span>
            </p>
        }
    </template>

