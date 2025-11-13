// LENIS SMOOTH SCROLL

const lenis = new Lenis({
    autoRaf: true,
});


// lenis.on('scroll', (e) => {
//     console.log(e);
// });

// GSAP ANIMATIONS

document.addEventListener("DOMContentLoaded", (event) => {
    gsap.registerPlugin(PixiPlugin, ScrollTrigger, SplitText, RoughEase)

    // document.querySelectorAll('.text-slide-in').forEach(elem => {
    //     const split = new SplitText(elem, { type: "lines" });
    //     gsap.from(split.lines, {
    //         yPercent: 100,
    //         opacity: 0,
    //         stagger: 0.1,
    //         duration: 0.6,
    //         ease: "expo.out",
    //         scrollTrigger: {
    //             trigger: elem,
    //             start: "top 80%",
    //             toggleActions: "play none none none",
    //             once: true
    //         }
    //     });
    // });



    // SplitText.create(".text-slide-in", {
    //     type: "lines",
    //     linesClass: "line",
    //     autoSplit: true,
    //     mask: "lines",
    //     onSplit: (self) => {
    //         gsap.from(self.lines, {
    //             y: 200,
    //             opacity: 1,
    //             duration: 1,
    //             stagger: 0.2,
    //             ease: "power2.out",
    //             scrollTrigger: {
    //                 trigger: ".text-slide-in",
    //                 start: "top bottom",
    //                 toggleActions: "play none none none"
    //             }
    //         });
    //     }
    // });
});

// const { splitText, animate, stagger, onScroll } = anime;

// animate('.slide-in', {
//     ease: 'out(1.68)'
// });

// document.addEventListener('DOMContentLoaded', () => {

//     const slideInTexts = document.querySelectorAll('.text-slide-in');

//     slideInTexts.forEach((slideInText, index) => {
//         const { words } = splitText(slideInText, {
//             words: true,
//         })

//         animate(words, {
//             opacity: [0, 1],
//             translateY: ['50%', '0%'],
//             duration: 400,
//             delay: stagger(100),
//             easing: 'outSine',
//             autoplay: onScroll({
//                 target: slideInText,
//             }),
//         }
//         );
//     });
// });

