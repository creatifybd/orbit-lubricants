import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync } from 'node:fs';
import { chromium } from 'playwright';

const base = 'http://127.0.0.1:4173';
const sizes = [
  { label: 'tiny-320', width: 320, height: 680 },
  { label: 'small-360', width: 360, height: 740 },
  { label: 'phone-375', width: 375, height: 812 },
  { label: 'phone-390', width: 390, height: 844 },
  { label: 'phone-414', width: 414, height: 896 },
  { label: 'large-phone-480', width: 480, height: 860 },
  { label: 'tablet-portrait', width: 768, height: 1024 },
  { label: 'tablet-landscape', width: 1024, height: 768 },
  { label: 'phone-landscape', width: 812, height: 375 },
  { label: 'laptop-nav-breakpoint', width: 1120, height: 800 },
  { label: 'laptop-1280', width: 1280, height: 800 },
  { label: 'desktop-1440', width: 1440, height: 900 },
  { label: 'wide-desktop', width: 1920, height: 1080 }
];
const routes = [
  {path:'/', name:'home', locator:'.premium-hero'},
  {path:'/products/', name:'catalog', locator:'.catalog-product-card'},
  {path:'/about/', name:'about', locator:'main'},
  {path:'/finder/', name:'finder', locator:'.finder-categories'},
  {path:'/contact/', name:'contact', locator:'main'},
  {path:'/product-gallery/', name:'gallery', locator:'figure.card img'},
  {path:'/products/nova-hd40-1l/', name:'product-detail', locator:'main article img'},
  {path:'/applications/motorcycle/', name:'application', locator:'main'},
  {path:'/admin/', name:'admin-login', locator:'input[type="password"]'}
];
const folder = 'qa-screenshots/responsive';
mkdirSync(folder, {recursive:true});
const browser = await chromium.launch({ headless:true, channel:'chrome' });
const report = [];
const failures = [];
const jsErrors = [];

async function inspect(page,width,height,route) {
  return await page.evaluate(({width,height,name})=>{
    const root=document.documentElement;
    const viewportWidth=window.innerWidth;
    const docWidth=root.scrollWidth;
    const bodyWidth=document.body.scrollWidth;
    const offenders=[...document.querySelectorAll('body *')].filter(el=>{
      const cs=getComputedStyle(el);
      if(cs.display==='none'||cs.visibility==='hidden'||parseFloat(cs.opacity)===0||cs.position==='fixed')return false;
      const r=el.getBoundingClientRect();
      if(r.width<=1||r.height<=1) return false;
      if(r.right <= viewportWidth+3 && r.left >= -3) return false;
      // Avoid flagging intentional clipped children inside scrollable carousels/tables.
      let parent=el.parentElement;
      while(parent && parent!==document.body){
        const s=getComputedStyle(parent);
        const overflow=s.overflowX;
        if(['auto','scroll','hidden','clip'].includes(overflow))return false;
        parent=parent.parentElement;
      }
      return true;
    }).slice(0,8).map(el=>({
      tag:el.tagName.toLowerCase(),
      classes:typeof el.className==='string'?el.className.slice(0,120):'',
      text:(el.textContent||'').trim().slice(0,55),
      left:Math.round(el.getBoundingClientRect().left),
      right:Math.round(el.getBoundingClientRect().right)
    }));
    return {name,width,height,viewportWidth,docWidth,bodyWidth,
      pageHeight:root.scrollHeight,offenders,
      marqueeCount:document.querySelectorAll('.orbit-product-marquee,.orbit-marquee-product').length,
      productCardCount:document.querySelectorAll('.catalog-product-card').length};
  },{width,height,name:route.name});
}

try {
  const context=await browser.newContext({
    viewport:{width:390,height:844},
    reducedMotion:'reduce',
    deviceScaleFactor:1
  });
  const page=await context.newPage();
  page.setDefaultTimeout(14000);
  page.on('pageerror',e=>jsErrors.push(e.message));

  for(const size of sizes){
    await page.setViewportSize({width:size.width,height:size.height});
    for(const route of routes){
      const id=size.label+' / '+route.name;
      try{
        const response=await page.goto(base+route.path,{waitUntil:'domcontentloaded'});
        assert.equal(response.status(),200,id+' must return HTTP 200');
        await page.locator(route.locator).first().waitFor({state:'visible'});
        if(route.name==='home'){
          assert.equal(await page.locator('.orbit-product-marquee,.orbit-marquee-product').count(),0,
            'Marquee still displayed after removal');
          assert.ok(await page.getByRole('heading',{level:2,name:'Featured products'}).count(),
            'Featured Product section should remain intact');
        }
        if(route.name==='catalog'){
          assert.equal(await page.locator('.catalog-product-card').count(),38,
            'All 38 original product cards must render');
          assert.ok(await page.getByRole('searchbox',{name:/Search Orbit products/}).count());
        }
        if(route.name==='gallery'){
          assert.equal(await page.locator('figure.card img').count(),38);
        }
        if(route.name==='admin-login'){
          assert.ok((await page.locator('input[type="password"]').count())>=1);
        }
        if(route.name==='application'){
          assert.ok(await page.locator('img[src^="/products/"]').count());
        }
        const r=await inspect(page,size.width,size.height,route);
        report.push(r);
        if(r.docWidth>r.viewportWidth+3 || r.bodyWidth>r.viewportWidth+3){
          failures.push(id+' horizontal overflow '+JSON.stringify(r));
        }
        if(route.name==='home'&&r.marqueeCount!==0){
          failures.push(id+' marquee still mounted');
        }
        if(['tiny-320','phone-375','tablet-portrait','desktop-1440'].includes(size.label) &&
           ['home','catalog','gallery','product-detail'].includes(route.name)){
          await page.screenshot({path:folder+'/'+size.label+'-'+route.name+'.png',fullPage:true,animations:'disabled'});
        }
      }catch(e){failures.push(id+': '+e.message);}
    }
    // Verify real navigation drawer at mobile widths and visible desktop navigation at desktop widths.
    try{
      await page.goto(base+'/',{waitUntil:'domcontentloaded'});
      if(size.width<1120){
        const toggle=page.getByRole('button',{name:'Toggle menu'});
        await toggle.waitFor();
        await toggle.click();
        const link=page.getByRole('link',{name:'Products & Technology'});
        await link.waitFor({state:'visible'});
        await link.click();
        await page.locator('.catalog-product-card').first().waitFor();
        assert.equal(await page.locator('.catalog-product-card').count(),38);
        assert.equal(await page.locator('.orbit-product-marquee').count(),0);
        const overflow=await inspect(page,size.width,size.height,{name:'after-mobile-nav'});
        if(overflow.docWidth>size.width+3)failures.push(size.label+' mobile nav overflow '+JSON.stringify(overflow));
      }else{
        assert.ok(await page.getByRole('link',{name:'Products & Technology'}).count(),
          'Desktop navigation missing at '+size.width);
      }
    }catch(e){failures.push(size.label+' / navigation: '+e.message);}
    console.log('Viewport audited: '+size.label+' ('+size.width+'×'+size.height+')');
  }

  // Mobile product comparison must scroll within its own container, not stretch the body.
  await page.setViewportSize({width:375,height:812});
  await page.goto(base+'/products/',{waitUntil:'domcontentloaded'});
  await page.locator('.catalog-product-card').first().waitFor();
  await page.locator('.catalog-compare').nth(0).click();
  await page.locator('.catalog-compare').nth(1).click();
  await page.locator('.orbit-compare-table').waitFor();
  const comparison=await inspect(page,375,812,{name:'comparison-mobile'});
  report.push(comparison);
  if(comparison.docWidth>378)failures.push('Mobile comparison stretches document: '+JSON.stringify(comparison));

  for(const err of jsErrors)failures.push('JavaScript error: '+err);
  writeFileSync(folder+'/viewport-report.json',JSON.stringify({
    checks:report.length,viewports:sizes,failures,rows:report
  },null,2));
  console.log(JSON.stringify({
    responsiveChecks:report.length,
    viewportCount:sizes.length,
    routes:routes.length,
    horizontalOverflowCases:report.filter(r=>r.docWidth>r.viewportWidth+3).map(r=>({
      viewport:r.width,route:r.name,extraPixels:r.docWidth-r.viewportWidth,offenders:r.offenders
    })),
    failures
  },null,2));
  assert.deepEqual(failures,[],'Responsive QA found regressions. Read viewport-report.json and failing messages');
  console.log('ORBIT RESPONSIVE QA PASSED: 13 sizes, 9 routes, mobile drawer, 38 cards, responsive comparison, zero document overflow and no marquee.');
  await context.close();
}finally{
  await browser.close();
}
