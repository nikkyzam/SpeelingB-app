import { UserPoints, PurchaseHistory, RewardItem } from '../../types/rewards';

export class PointsService {
  public static STORAGE_KEY = 'kids_spelling_points';
  private static HISTORY_KEY = 'kids_spelling_purchase_history';
  private static STREAK_KEY = 'kids_spelling_streak';

  static initializePoints(): UserPoints {
    const defaultPoints: UserPoints = {
      totalPoints: 100,
      availablePoints: 100,
      spentPoints: 0,
      lastEarned: new Date(),
      dailyStreak: 0,
      lastLogin: new Date(),
      highestCombo: 0,
      pointsToday: 0,
      weeklyPoints: 0
    };

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(defaultPoints));
    localStorage.setItem(this.STREAK_KEY, JSON.stringify({
      lastLogin: new Date().toDateString(),
      streak: 0
    }));

    return defaultPoints;
  }

  static getPoints(): UserPoints {
    const points = localStorage.getItem(this.STORAGE_KEY);
    if (!points) {
      return this.initializePoints();
    }

    const parsedPoints = JSON.parse(points);
    this.updateStreak();

    return parsedPoints;
  }

  static updateStreak(): void {
    const today = new Date().toDateString();
    const streakData = localStorage.getItem(this.STREAK_KEY);
    let streak = streakData ? JSON.parse(streakData) : { lastLogin: '', streak: 0 };

    if (streak.lastLogin !== today) {
      const lastLogin = new Date(streak.lastLogin);
      const todayDate = new Date(today);
      const diffTime = Math.abs(todayDate.getTime() - lastLogin.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        streak.streak += 1;
      } else if (diffDays > 1) {
        streak.streak = 1;
      }

      streak.lastLogin = today;
      localStorage.setItem(this.STREAK_KEY, JSON.stringify(streak));

      const points = this.getPoints();
      points.dailyStreak = streak.streak;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(points));
    }
  }

  static addPoints(amount: number, reason: string = 'activity'): UserPoints {
    const points = this.getPoints();
    const updatedPoints: UserPoints = {
      ...points,
      totalPoints: points.totalPoints + amount,
      availablePoints: points.availablePoints + amount,
      pointsToday: points.pointsToday + amount,
      weeklyPoints: points.weeklyPoints + amount,
      lastEarned: new Date()
    };

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedPoints));

    // Trigger points earned event for UI
    const event = new CustomEvent('pointsEarned', {
      detail: { amount, reason, total: updatedPoints.availablePoints }
    });
    window.dispatchEvent(event);

    return updatedPoints;
  }

  static addComboPoints(combo: number): number {
    const basePoints = 10;
    const comboBonus = Math.floor(combo / 5) * 5;
    const total = basePoints + comboBonus;

    this.addPoints(total, `${combo}-word combo`);

    const points = this.getPoints();
    if (combo > points.highestCombo) {
      points.highestCombo = combo;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(points));
    }

    return total;
  }

  static spendPoints(amount: number, reward: RewardItem): boolean {
    if (!Number.isFinite(amount) || amount <= 0) return false;
    const points = this.getPoints();

    if (points.availablePoints < amount) {
      return false;
    }

    const updatedPoints: UserPoints = {
      ...points,
      availablePoints: points.availablePoints - amount,
      spentPoints: points.spentPoints + amount
    };

    const purchase: PurchaseHistory = {
      id: crypto.randomUUID(),
      rewardId: reward.id,
      rewardName: reward.name,
      purchaseDate: new Date(),
      cost: amount,
      category: reward.category
    };

    this.addToHistory(purchase);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedPoints));

    // Trigger purchase event
    const event = new CustomEvent('rewardPurchased', { detail: { reward, points: updatedPoints } });
    window.dispatchEvent(event);

    return true;
  }

  static addToHistory(purchase: PurchaseHistory): void {
    const history = localStorage.getItem(this.HISTORY_KEY);
    const purchases: PurchaseHistory[] = history ? JSON.parse(history) : [];
    purchases.push(purchase);
    localStorage.setItem(this.HISTORY_KEY, JSON.stringify(purchases));
  }

  static getPurchaseHistory(): PurchaseHistory[] {
    const history = localStorage.getItem(this.HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  }

  /** Refund spending without counting it as newly earned learning stars. */
  static refundPurchase(id: string): boolean {
    const history = this.getPurchaseHistory();
    const purchase = history.find(p => p.id === id);
    if (!purchase || purchase.refundedAt || !Number.isFinite(purchase.cost) || purchase.cost <= 0) return false;
    const points = this.getPoints();
    purchase.refundedAt = new Date().toISOString();
    localStorage.setItem(this.HISTORY_KEY, JSON.stringify(history));
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify({ ...points,
      availablePoints: points.availablePoints + purchase.cost,
      spentPoints: Math.max(0, points.spentPoints - purchase.cost),
    }));
    window.dispatchEvent(new Event('pointsEarned'));
    return true;
  }

  /**
   * Categories the old shop sold that never did anything. Only these are
   * refunded, by name: refunding "anything that isn't a buddy item" would
   * silently undo any new kind of purchase added later. Buddy items work and
   * real-world promises stay in history for the family.
   */
  static readonly RETIRED_CATEGORIES = ['avatar', 'faith', 'games', 'learning', 'powerup', 'sticker', 'streak', 'theme'];

  static refundUnsupportedItems(): number {
    let amount = 0;
    for (const p of this.getPurchaseHistory()) {
      if (!p.rewardId.startsWith('buddy-') && this.RETIRED_CATEGORIES.includes(p.category) && !p.refundedAt) {
        if (this.refundPurchase(p.id)) amount += p.cost;
      }
    }
    return amount;
  }

  static resetDailyPoints(): void {
    const points = this.getPoints();
    points.pointsToday = 0;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(points));
  }

  static resetWeeklyPoints(): void {
    const points = this.getPoints();
    points.weeklyPoints = 0;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(points));
  }

  static getDailyStreak(): number {
    const streakData = localStorage.getItem(this.STREAK_KEY);
    return streakData ? JSON.parse(streakData).streak : 0;
  }
}
