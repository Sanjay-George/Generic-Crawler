const PAGE_LOAD_TIMEOUT = 10000;
const ACTIONABILITY_TIMEOUT = 5000;
const MAX_ATTEMPTS = 3;

function getWaitOptions(customTimeout) {
	return { waitUntil: 'load', timeout: customTimeout || PAGE_LOAD_TIMEOUT };
} 

async function openTab(browser, url, callback = null, attempt = 1, timeout = 0) {
	console.log(`\nOpening URL : ${url}`);

	const context = await browser.newContext({
		bypassCSP: true,
		colorScheme: 'light',
		recordVideo: {
			dir: './videos/'
		},
	});
	// context.setDefaultTimeout(5000);
	context.grantPermissions(['geolocation', 'notifications']);
    const page = await context.newPage();

	// await disableHeavyResources(page);
	
	try {
		await page.goto(url, getWaitOptions(attempt * PAGE_LOAD_TIMEOUT));
		callback && await callback(page);
	}
	catch(ex) {
		console.error("\nEXCEPTION:");
		console.error(ex);
		if(ex.name === "TimeoutError" && attempt < MAX_ATTEMPTS) {
			await closeTab(page);
			return await openTab(browser, url, callback, attempt+1);
		}
		return null;
	}
    return page;
}

async function reloadPage(page, callback = null, attempt = 0)
{
	try {
		await page.reload(getWaitOptions(attempt * PAGE_LOAD_TIMEOUT));
		await page.waitForLoadState('networkidle');
		callback && await callback(page);
	}
	catch(ex) {
		console.error("\nEXCEPTION:");
		console.error(ex);
		if(ex.name === "TimeoutError" && attempt < MAX_ATTEMPTS) {
			// await closeTab(page);
			return await reloadPage(page, callback, attempt+1);
		}
	}
}

async function goBack(page, callback = null, attempt = 0)
{
	const currUrl = page.url();
	let httpRes = null;
	try {
		httpRes = await page.goBack(getWaitOptions(attempt * PAGE_LOAD_TIMEOUT));
		await page.waitForLoadState('networkidle');
		callback && await callback(page);
	}
	catch(ex) {
		console.error("\nEXCEPTION:");
		console.error(ex);
		if(ex.name === "TimeoutError" && attempt < MAX_ATTEMPTS) {
			// await closeTab(page);
			if(page.url() === currUrl) {
				await reloadPage(page, callback);
				return await goBack(page, callback, attempt+1);
			}
			await reloadPage(page, callback);
			return await goBack(page, callback, attempt+1);
		}
	}
	return httpRes;
}


async function closeTab(page) {
    if(page === undefined) return;  
    return page.close();
}


async function click(selector, page, byPassChecks = false) {
	try {
		const locator = page.locator(selector);
		await locator.first().click({
			force: byPassChecks,
			timeout: byPassChecks ? 500 : ACTIONABILITY_TIMEOUT,   
			// todo: improve the timeout logic. 
			// If the page is already loaded, decrease timeout, else keep higher
		});
		return true;
	}
	catch(ex) {
		console.error("\nEXCEPTION:");
		console.error(ex);
		// if(ex instanceof playwright.errors.TimeoutError) {
		// TODO: calculate the timeout based on current speed of transimission (networkidle - domcontentloaded)
		// 	return await click(selector, page, byPassChecks);
		// }
	}
	return false;
}

async function getInnerText(selector, page)
{
	if(!selector || !selector.length)       return null;
	
	try {
		const isValidQuerySelector = await page.evaluate(selector => {
            return DomUtils.isValidQuerySelector(selector);
        }, selector);

		if(!isValidQuerySelector) {
			return selector;
		}

		const locator = page.locator(selector);
		await locator.waitFor({
			// state: 'attached',
			timeout: ACTIONABILITY_TIMEOUT,
		});
		return (await locator.innerText()).trim();
	}
	catch(ex) {
		console.error("\nEXCEPTION:");
		console.error(ex);
	}
	return null;
}

async function disableHeavyResources(page) {
	const heavyResources = ["media", "font"]; 
	// const heavyResources = ["image"]; 
	const blockedReqKeywords = ["video", "playback", "youtube", "autoplay"];

	// await page.setRequestInterception(true);
	await page.route("**/*", async route => {
		const request = route.request();
		if (heavyResources.includes(request.resourceType())) { 
			await route.abort();
			return;
		}

		let blockReq = false;
		for(let i = 0; i < blockedReqKeywords.length; i++) {
			if(request.url().includes(blockedReqKeywords[i])) {
				blockReq = true;
				break;
			}
		}
		if(blockReq) {
			await route.abort(); 
			return;
		}

		await route.continue();
	});

	// page.on('request', async request => {
	// 	try{
	// 		if (heavyResources.includes(request.resourceType())) { 
	// 			await request.abort();
	// 			return;
	// 		}

	// 		let blockReq = false;
	// 		for(let i = 0; i < blockedReqKeywords.length; i++) {
	// 			if(request.url().includes(blockedReqKeywords[i])) {
	// 				blockReq = true;
	// 				break;
	// 			}
	// 		}
	// 		if(blockReq) {
	// 			await request.abort(); 
	// 			return;
	// 		}

	// 		await request.continue();
	// 	}
	// 	catch(ex) {
	// 		console.error(ex);
	// 	}
	// });
}




module.exports = {
    openTab,
    closeTab,
	getWaitOptions,
	goBack,
	reloadPage,
	click,
	getInnerText
}