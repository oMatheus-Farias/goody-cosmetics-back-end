"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindAllProductsByCategoryIdUseCase = void 0;
const errors_1 = require("../../errors");
class FindAllProductsByCategoryIdUseCase {
    constructor(productsRepo, categoriesRepo) {
        this.productsRepo = productsRepo;
        this.categoriesRepo = categoriesRepo;
    }
    execute(categoryId, ordernation) {
        return __awaiter(this, void 0, void 0, function* () {
            if (categoryId) {
                const category = yield this.categoriesRepo.findById(categoryId);
                if (!category) {
                    throw new errors_1.NotFoundError('Category not found');
                }
            }
            return yield this.productsRepo.findAllByCategory(categoryId, ordernation);
        });
    }
}
exports.FindAllProductsByCategoryIdUseCase = FindAllProductsByCategoryIdUseCase;
