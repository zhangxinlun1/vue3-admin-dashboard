// 移动端视口高度处理工具
export class MobileViewportHandler {
  constructor() {
    this.initialViewportHeight = window.innerHeight;
    this.isMobile = window.innerWidth <= 1024; // 改为1024px，包含iPad
    this.init();
  }

  init() {
    if (!this.isMobile) return;

    // 设置初始视口高度
    this.setViewportHeight();
    
    // 监听窗口大小变化
    window.addEventListener('resize', this.handleResize.bind(this));
    window.addEventListener('orientationchange', this.handleOrientationChange.bind(this));
    
    // 监听键盘弹出/收起
    this.handleKeyboardEvents();
  }

  setViewportHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }

  handleResize() {
    const currentHeight = window.innerHeight;
    
    // 如果高度减少，说明键盘弹出
    if (currentHeight < this.initialViewportHeight) {
      document.body.style.height = `${currentHeight}px`;
      document.body.style.overflow = 'hidden';
    } else {
      // 键盘收起，恢复原始状态
      document.body.style.height = '';
      document.body.style.overflow = '';
      this.initialViewportHeight = currentHeight;
    }
    
    this.setViewportHeight();
  }

  handleOrientationChange() {
    // 屏幕旋转时重新设置视口高度
    setTimeout(() => {
      this.initialViewportHeight = window.innerHeight;
      this.setViewportHeight();
    }, 100);
  }

  handleKeyboardEvents() {
    // 监听输入框焦点事件
    document.addEventListener('focusin', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') {
        // 输入框获得焦点时，确保页面不会跳动
        setTimeout(() => {
          e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
      }
    });

    // 监听输入框失焦事件
    document.addEventListener('focusout', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') {
        // 输入框失去焦点时，恢复页面状态
        setTimeout(() => {
          window.scrollTo(0, 0);
        }, 100);
      }
    });
  }

  destroy() {
    if (!this.isMobile) return;
    
    window.removeEventListener('resize', this.handleResize.bind(this));
    window.removeEventListener('orientationchange', this.handleOrientationChange.bind(this));
    
    // 恢复原始状态
    document.body.style.height = '';
    document.body.style.overflow = '';
    document.documentElement.style.removeProperty('--vh');
  }
}

// 创建全局实例
export const mobileViewportHandler = new MobileViewportHandler();

// 在组件中使用
export function useMobileViewport() {
  return {
    mobileViewportHandler
  };
} 