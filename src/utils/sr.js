let scrollReveal;

const sr = {
  async reveal(...args) {
    if (typeof window === 'undefined') {
      return;
    }

    if (!scrollReveal) {
      const { default: ScrollReveal } = await import('scrollreveal');
      scrollReveal = ScrollReveal();
    }

    scrollReveal.reveal(...args);
  },
};

export default sr;
