import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useOutletContext } from "react-router";
import { DualThemeGlassCard } from "../components/DualThemeGlassCard";
import { useUser } from "../context/UserContext";
import { storeItems, StoreItem } from "../data/storeData";
import { ShoppingBag, Coins, Ticket, Shirt, Package, BookOpen, Sparkles, Check, X } from "lucide-react";

interface LayoutContext {
  isDark: boolean;
}

export function StorePage() {
  const { isDark } = useOutletContext<LayoutContext>();
  const { userData, purchaseItem, purchaseCoupon, purchasePremium } = useUser();
  const [selectedCategory, setSelectedCategory] = useState<"all" | "premium" | "coupon" | "apparel" | "accessories" | "books" | "other">("all");
  const [purchaseModal, setPurchaseModal] = useState<{ show: boolean; item: StoreItem | null; success: boolean; insufficient: boolean }>({
    show: false,
    item: null,
    success: false,
    insufficient: false,
  });

  const categories = [
    { id: "all", label: "All Items", icon: ShoppingBag },
    { id: "premium", label: "Premium", icon: Sparkles },
    { id: "coupon", label: "Coupons", icon: Ticket },
    { id: "apparel", label: "Apparel", icon: Shirt },
    { id: "accessories", label: "Accessories", icon: Package },
    { id: "books", label: "Books", icon: BookOpen },
    { id: "other", label: "Others", icon: Sparkles },
  ];

  const filteredItems = storeItems.filter((item) => {
    if (selectedCategory === "all") return true;
    if (selectedCategory === "premium") return item.type === "premium";
    if (selectedCategory === "coupon") return item.type === "coupon";
    return item.category === selectedCategory;
  });

  const handlePurchase = (item: StoreItem) => {
    let success = false;

    if (item.type === "premium") {
      success = purchasePremium(item.price);
    } else if (item.type === "coupon") {
      success = purchaseCoupon(item.id, item.discount || 0, item.price);
    } else {
      success = purchaseItem(item.id, item.price);
    }

    if (success) {
      setPurchaseModal({ show: true, item, success: true, insufficient: false });
    } else {
      setPurchaseModal({ show: true, item, success: false, insufficient: true });
    }
  };

  const closeModal = () => {
    setPurchaseModal({ show: false, item: null, success: false, insufficient: false });
  };

  const isItemPurchased = (itemId: string, itemType: string) => {
    if (itemType === "premium") {
      return userData.hasPremium;
    }
    if (itemType === "coupon") {
      return userData.discountCoupons.some((c) => c.id === itemId);
    }
    return userData.purchasedItems.includes(itemId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h1
          className={`text-5xl font-black mb-4 transition-colors duration-300 ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          🛍️ CodeStreak Store
        </h1>
        <p className={`text-lg ${isDark ? "text-gray-300" : "text-gray-600"}`}>
          Redeem your coins for discount coupons and exclusive merchandise!
        </p>
        <div
          className={`inline-flex items-center gap-2 mt-4 px-6 py-3 rounded-full font-bold ${
            isDark ? "bg-yellow-500/20 text-yellow-400" : "bg-yellow-100 text-yellow-700"
          }`}
        >
          <Coins className="w-5 h-5" />
          <span className="text-xl">{userData.coins.toLocaleString()}</span>
          <span className="text-sm opacity-75">coins available</span>
        </div>
      </motion.div>

      {/* Category Filter */}
      <div className="mb-8 flex flex-wrap gap-3">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <motion.button
              key={category.id}
              onClick={() => setSelectedCategory(category.id as any)}
              className={`px-6 py-3 rounded-lg font-bold transition-all duration-300 flex items-center gap-2 ${
                selectedCategory === category.id
                  ? isDark
                    ? "bg-green-500/20 text-green-400 border-2 border-green-500/50"
                    : "bg-green-100 text-green-700 border-2 border-green-400/50"
                  : isDark
                  ? "bg-gray-800/50 text-gray-300 hover:bg-gray-800"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon className="w-5 h-5" />
              {category.label}
            </motion.button>
          );
        })}
      </div>

      {/* Store Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map((item, index) => {
          const isPurchased = isItemPurchased(item.id, item.type);
          
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <DualThemeGlassCard isDark={isDark}>
                <div className="p-6 relative">
                  {/* Item Badge */}
                  {item.type === "coupon" && (
                    <div
                      className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold ${
                        isDark ? "bg-purple-500/20 text-purple-400" : "bg-purple-100 text-purple-700"
                      }`}
                    >
                      {item.discount}% OFF
                    </div>
                  )}

                  {isPurchased && (
                    <div
                      className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                        isDark ? "bg-green-500/20 text-green-400" : "bg-green-100 text-green-700"
                      }`}
                    >
                      <Check className="w-3 h-3" />
                      Owned
                    </div>
                  )}

                  {/* Item Icon */}
                  <div className="text-6xl mb-4 text-center">{item.image}</div>

                  {/* Item Info */}
                  <h3
                    className={`text-lg font-black mb-2 text-center ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {item.name}
                  </h3>
                  <p
                    className={`text-sm mb-4 text-center min-h-[60px] ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {item.description}
                  </p>

                  {/* Price */}
                  <div
                    className={`flex items-center justify-center gap-2 mb-4 p-3 rounded-lg ${
                      isDark ? "bg-yellow-500/10" : "bg-yellow-50"
                    }`}
                  >
                    <Coins
                      className={isDark ? "w-5 h-5 text-yellow-400" : "w-5 h-5 text-yellow-600"}
                    />
                    <span
                      className={`text-xl font-black ${
                        isDark ? "text-yellow-300" : "text-yellow-700"
                      }`}
                    >
                      {item.price.toLocaleString()}
                    </span>
                  </div>

                  {/* Stock Status */}
                  {item.inStock !== undefined && (
                    <p
                      className={`text-xs text-center mb-3 ${
                        item.inStock
                          ? isDark
                            ? "text-green-400"
                            : "text-green-600"
                          : isDark
                          ? "text-red-400"
                          : "text-red-600"
                      }`}
                    >
                      {item.inStock ? "✓ In Stock" : "✗ Out of Stock"}
                    </p>
                  )}

                  {/* Purchase Button */}
                  <motion.button
                    onClick={() => handlePurchase(item)}
                    disabled={isPurchased || (item.inStock !== undefined && !item.inStock)}
                    className={`w-full py-3 rounded-lg font-bold transition-all duration-300 ${
                      isPurchased
                        ? isDark
                          ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : item.inStock === false
                        ? isDark
                          ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : isDark
                        ? "bg-gradient-to-r from-green-600 to-green-700 text-white hover:shadow-[0_0_20px_rgba(34,197,94,0.4)]"
                        : "bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-lg"
                    }`}
                    whileHover={!isPurchased && item.inStock !== false ? { scale: 1.05 } : {}}
                    whileTap={!isPurchased && item.inStock !== false ? { scale: 0.95 } : {}}
                  >
                    {isPurchased ? "Already Owned" : item.inStock === false ? "Out of Stock" : "Purchase"}
                  </motion.button>
                </div>
              </DualThemeGlassCard>
            </motion.div>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <p className={`text-lg ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            No items found in this category.
          </p>
        </div>
      )}

      {/* Purchase Modal */}
      <AnimatePresence>
        {purchaseModal.show && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-md w-full"
            >
              <DualThemeGlassCard isDark={isDark}>
                <div className="p-8 text-center">
                  {purchaseModal.success ? (
                    <>
                      {/* Success */}
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", duration: 0.5 }}
                      >
                        <Check className="w-20 h-20 text-green-500 mx-auto mb-4" />
                      </motion.div>
                      <h2
                        className={`text-3xl font-black mb-4 text-green-500`}
                      >
                        Purchase Successful!
                      </h2>
                      <p className={`mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                        You've successfully purchased:
                      </p>
                      <p className={`text-xl font-bold mb-6 ${isDark ? "text-white" : "text-gray-900"}`}>
                        {purchaseModal.item?.name}
                      </p>
                      <div
                        className={`p-4 rounded-lg mb-6 ${
                          isDark ? "bg-gray-800/50" : "bg-gray-100"
                        }`}
                      >
                        <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                          Remaining Balance
                        </p>
                        <div className="flex items-center justify-center gap-2 mt-2">
                          <Coins
                            className={isDark ? "w-5 h-5 text-yellow-400" : "w-5 h-5 text-yellow-600"}
                          />
                          <span
                            className={`text-2xl font-black ${
                              isDark ? "text-yellow-300" : "text-yellow-700"
                            }`}
                          >
                            {userData.coins.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Insufficient Balance */}
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", duration: 0.5 }}
                      >
                        <X className="w-20 h-20 text-red-500 mx-auto mb-4" />
                      </motion.div>
                      <h2
                        className={`text-3xl font-black mb-4 ${
                          isDark ? "text-red-400" : "text-red-600"
                        }`}
                      >
                        Insufficient Balance
                      </h2>
                      <p className={`mb-6 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                        You don't have enough coins to purchase this item.
                      </p>
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div
                          className={`p-4 rounded-lg ${
                            isDark ? "bg-red-500/10" : "bg-red-50"
                          }`}
                        >
                          <p className={`text-xs ${isDark ? "text-red-400" : "text-red-600"}`}>
                            Required
                          </p>
                          <div className="flex items-center justify-center gap-1 mt-1">
                            <Coins className="w-4 h-4" />
                            <span className="font-bold">{purchaseModal.item?.price}</span>
                          </div>
                        </div>
                        <div
                          className={`p-4 rounded-lg ${
                            isDark ? "bg-yellow-500/10" : "bg-yellow-50"
                          }`}
                        >
                          <p className={`text-xs ${isDark ? "text-yellow-400" : "text-yellow-600"}`}>
                            Your Balance
                          </p>
                          <div className="flex items-center justify-center gap-1 mt-1">
                            <Coins className="w-4 h-4" />
                            <span className="font-bold">{userData.coins}</span>
                          </div>
                        </div>
                      </div>
                      <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                        Complete more courses and quizzes to earn coins!
                      </p>
                    </>
                  )}

                  <motion.button
                    onClick={closeModal}
                    className={`w-full mt-6 py-3 rounded-lg font-bold transition-all duration-300 ${
                      isDark
                        ? "bg-gray-800 text-white hover:bg-gray-700"
                        : "bg-gray-200 text-gray-900 hover:bg-gray-300"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Close
                  </motion.button>
                </div>
              </DualThemeGlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}