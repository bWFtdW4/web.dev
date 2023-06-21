import { syncNameA, syncNameB, syncNameC, syncNameD } from "./synchronous-functors.js"
import { asyncNameA, asyncNameB, asyncNameC, asyncNameD, quasiAsyncNameE } from "./asynchronous-functors.js"
import MyThing from "./thing.js"


window.addEventListener("load", async event => {
	const centerArticle = document.querySelector("main > article.center");
	const preformattedElement = centerArticle.querySelector("pre");

	preformattedElement.append(syncNameA(1, 2, 3) + "\n");
	preformattedElement.append(syncNameB(1, 2, 3) + "\n");
	preformattedElement.append(syncNameC(1, 2, 3) + "\n");
	preformattedElement.append(syncNameD(1, 2, 3) + "\n\n");

	preformattedElement.append(await asyncNameA(1, 2, 3) + "\n");
	preformattedElement.append(await asyncNameB(1, 2, 3) + "\n");
	preformattedElement.append(await asyncNameC(1, 2, 3) + "\n");
	preformattedElement.append(await asyncNameD(1, 2, 3) + "\n");
	preformattedElement.append(await quasiAsyncNameE(1, 2, 3) + "\n\n");

	const promise = quasiAsyncNameE(1, 2, 3);

	// this approach is no longer state-of-the-art, as it causes callback-hell!
	// promise
	//	.then(result => preformattedElement.append(result))
	//	.catch(error => { throw error; });
	// preformattedElement.append("Zu Beachten:\n");

	// this is state-of-the-art, replacing one (optional) then-call
	// and one (optional) catch-call:
	const result = await promise;
	preformattedElement.append("Zu Beachten:\n");
	preformattedElement.append(result + "\n\n");

	const instanceA = new MyThing("Aloha!");
	preformattedElement.append("instanceA: " + instanceA + "\n");

	const instanceB = MyThing.createPublicSynchronousThing("Hallo!");
	preformattedElement.append("instanceB: " + instanceB + "\n");

	const instanceC = await MyThing.createPublicAsynchronousThing("Hello!");
	preformattedElement.append("instanceC: " + instanceC + "\n\n");

	preformattedElement.append("instanceA.myPrivateInstanceVariable: " + instanceA.myPrivateInstanceVariable + "\n");
	preformattedElement.append("instanceB.myPrivateInstanceVariable: " + instanceB.myPrivateInstanceVariable + "\n");
	preformattedElement.append("instanceC.myPrivateInstanceVariable: " + instanceC.myPrivateInstanceVariable + "\n\n");
});
