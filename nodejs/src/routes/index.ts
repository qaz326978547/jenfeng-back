import { Router } from "express";
import { requireAdmin, requireAuth } from "../middleware/auth";
import * as authController from "../controllers/auth.controller";
import * as seoController from "../controllers/seo.controller";
import * as faqController from "../controllers/faq.controller";
import * as contactClassController from "../controllers/contactClass.controller";
import * as contactQuestController from "../controllers/contactQuest.controller";
import * as contactController from "../controllers/contact.controller";
import * as contactListController from "../controllers/contactList.controller";

export const apiRouter = Router();

// Public
apiRouter.get("/seo", seoController.index);
apiRouter.get("/contact-class", contactClassController.index);
apiRouter.get("/contact-quest", contactQuestController.index);
apiRouter.post("/contact", contactController.store);
apiRouter.get("/faq", faqController.index);

apiRouter.post("/auth/login", authController.login);
apiRouter.post("/auth/register", authController.register);
apiRouter.post("/auth/logout", requireAuth, authController.logout);

// Admin (auth + is_admin required — see middleware/auth.ts for the fix
// applied here relative to the original, which only checked auth:api)
const admin = Router();
admin.use(requireAuth, requireAdmin);

admin.get("/contact", contactController.index);
admin.get("/contact/search/search-company", contactController.searchCompany);
admin.get("/contact/:id", contactController.show);
admin.put("/contact/:id", contactController.update);
admin.patch("/contact/:id", contactController.update);
admin.delete("/contact", contactController.destroy);

admin.get("/contact-list", contactListController.index);
admin.get("/contact-list/:id", contactListController.show);

admin.post("/contact-class", contactClassController.store);
admin.get("/contact-class/:id", contactClassController.show);
admin.put("/contact-class/:id", contactClassController.update);
admin.patch("/contact-class/:id", contactClassController.update);
admin.delete("/contact-class", contactClassController.destroy);

apiRouter.use("/admin", admin);
