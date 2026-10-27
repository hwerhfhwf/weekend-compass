const $=s=>document.querySelector(s);const $$=s=>[...document.querySelectorAll(s)];
const state={saved:JSON.parse(localStorage.getItem('weekendCompassSaved')||'[]'),pref:'松弛散步'};
const toast=msg=>{const el=$('#toast');el.textContent=msg;el.classList.add('show');clearTimeout(window.tt);window.tt=setTimeout(()=>el.classList.remove('show'),2200)};
const modal=html=>{$('#modalContent').innerHTML=html;$('#modal').classList.add('open');$('#modal').setAttribute('aria-hidden','false')};
$('#closeModal').onclick=()=>$('#modal').classList.remove('open');$('#modal').onclick=e=>{if(e.target.id==='modal')$('#modal').classList.remove('open')};
$('#savedCount').textContent=state.saved.length;
$$('.chip').forEach(c=>c.onclick=()=>{$$('.chip').forEach(x=>x.classList.remove('active'));c.classList.add('active');state.pref=c.dataset.pref});

const plans={rain:{title:'雨天也不狼狈的梧桐区漫游',reason:'路线 82% 在室内或有连廊，全程步行暴露不超过 12 分钟。',weather:'阵雨转小雨',hint:'适合室内漫游',temp:'18°',proof:'这是一条雨天友好路线',proofText:'3 个室内点位 · 最长露天步行 8 分钟 · 每站都有临时避雨处',score:'96',cost:'¥ 182'},sun:{title:'追着秋日阳光走的城市绿线',reason:'把最适合户外的时段留给河岸与公园，16:00 后自然转入室内。',weather:'晴间多云',hint:'体感舒适，宜步行',temp:'23°',proof:'阳光最好的 4 小时已排在户外',proofText:'黄金光线 13:20—16:40 · 绿荫覆盖 68% · 傍晚就近转室内',score:'94',cost:'¥ 168'}};
function renderPlan(){const sunny=$('#date').value==='sun',p=plans[sunny?'sun':'rain'];$('#planTitle').textContent=p.title;$('#planReason').textContent=p.reason;$('#weatherTitle').textContent=p.weather;$('#weatherHint').textContent=p.hint;$('#weatherTemp').textContent=p.temp;$('#proofTitle').textContent=p.proof;$('#proofText').textContent=p.proofText;$('#fitScore').textContent=p.score;$('#totalCost').textContent=p.cost;$('.rain').style.display=sunny?'none':'block';$$('.cover>i').forEach(x=>x.style.display=sunny?'none':'block');$('.proof-icon').textContent=sunny?'☀':'☂';$('#weatherProof').style.background=sunny?'#9c671d':'#0b3a2d'}
$('#date').onchange=renderPlan;
$('#generateBtn').onclick=()=>{renderPlan();const city=$('#city').value;$('#route').scrollIntoView({behavior:'smooth'});toast(`已按${city} · ${state.pref}重新规划`)};
$('#saveBtn').onclick=()=>{const key=$('#planTitle').textContent;if(!state.saved.includes(key)){state.saved.push(key);localStorage.setItem('weekendCompassSaved',JSON.stringify(state.saved));$('#savedCount').textContent=state.saved.length;$('#saveBtn').textContent='✓ 已收藏';toast('路线已保存到本机')}else toast('这条路线已经收藏')};
$('#savedBtn').onclick=()=>modal(`<p class="eyebrow">我的收藏</p><h3>${state.saved.length?state.saved.length+' 条可出发路线':'还没有收藏'}</h3><p>${state.saved.length?state.saved.map((x,i)=>`${i+1}. ${x}`).join('<br>'):'看到合适的路线，点一下收藏即可。'}</p>`);
$('#joinBtn').onclick=()=>modal(`<p class="eyebrow">同行小队</p><h3>一句话约齐朋友</h3><p>路线、时间、预算都已打包，不需要在群里来回确认。</p><input id="teamName" placeholder="给小队起个名字" value="周六不宅家"/><button class="go" onclick="document.querySelector('#modal').classList.remove('open');navigator.clipboard?.writeText(location.href);">创建并复制邀请链接</button>`);
$('#checkBtn').onclick=()=>{const n=Number(localStorage.getItem('weekendChecks')||0)+1;localStorage.setItem('weekendChecks',n);toast(`第 ${n} 个地点已打卡 ✓`)};
$('#shareBtn').onclick=async()=>{const data={title:'周末罗盘路线',text:$('#planTitle').textContent,url:location.href};if(navigator.share)await navigator.share(data);else{await navigator.clipboard?.writeText(location.href);toast('路线链接已复制')}};
$('#noteBtn').onclick=()=>modal(`<p class="eyebrow">精简攻略</p><h3>只写下一位真正需要的</h3><p>不必记录全过程，只留下一个亮点和一个避坑提醒。</p><textarea rows="3" placeholder="亮点：例如二楼西侧窗边最好拍"></textarea><textarea rows="3" placeholder="避坑：例如雨天从南门进有连廊"></textarea><button class="go" onclick="localStorage.setItem('weekendNote','saved');document.querySelector('#modal').classList.remove('open')">保存攻略</button>`);
renderPlan();
