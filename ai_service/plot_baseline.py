import matplotlib.pyplot as plt
import numpy as np
import os

# Data
models = ['Logistic Regression', 'Random Forest', 'CatBoost (Đề xuất)']
accuracy = [74.42, 72.75, 74.98]
recall = [76.01, 76.42, 80.00]

# Set up the bar chart
x = np.arange(len(models))
width = 0.35

fig, ax = plt.subplots(figsize=(9, 6))
rects1 = ax.bar(x - width/2, accuracy, width, label='Độ chính xác (Accuracy)', color='#4c72b0')
rects2 = ax.bar(x + width/2, recall, width, label='Độ nhạy (Recall)', color='#dd8452')

# Add text for labels, title and custom x-axis tick labels, etc.
ax.set_ylabel('Tỷ lệ (%)', fontsize=12)
ax.set_title('So sánh Hiệu năng giữa các Mô hình Cơ sở (Baseline) và CatBoost', fontsize=14, fontweight='bold', pad=20)
ax.set_xticks(x)
ax.set_xticklabels(models, fontsize=11)
ax.legend(loc='upper left', bbox_to_anchor=(1, 1))

# Set y-axis limit higher to make room for labels
ax.set_ylim(0, 100)

# Attach a text label above each bar, displaying its height
def autolabel(rects):
    for rect in rects:
        height = rect.get_height()
        ax.annotate('{}%'.format(height),
                    xy=(rect.get_x() + rect.get_width() / 2, height),
                    xytext=(0, 3),  # 3 points vertical offset
                    textcoords="offset points",
                    ha='center', va='bottom', fontweight='bold')

autolabel(rects1)
autolabel(rects2)

fig.tight_layout()

# Save the plot
output_path = r"d:\Luan van\images\baseline_comparison.png"
# Create directory if it doesn't exist
os.makedirs(os.path.dirname(output_path), exist_ok=True)
plt.savefig(output_path, dpi=300, bbox_inches='tight')
print(f"Chart saved to {output_path}")
