

document.addEventListener("DOMContentLoaded", (event) => {
    gsap.registerPlugin(ScrambleTextPlugin, ScrollTrigger, SplitText)

    // ===== LENIS SMOOTH SCROLL INTEGRATION =====

    const lenis = new Lenis();

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // ======= GSAP ANIMATIONS ========

    // TEXT LEFT SLIDE IN

    var leftSlideIns = gsap.utils.toArray(".left-slide-in");

    leftSlideIns.forEach((leftSlideIn) => {

        gsap.fromTo(
            leftSlideIn,
            {
                autoAlpha: 0,
                x: -100
            },
            {
                autoAlpha: 1,
                x: 0,
                duration: 4,
                ease: "expo.out",
                scrollTrigger: {
                    trigger: leftSlideIn,
                    start: "top 75%",
                    end: "bottom 25%",
                    scrub: true,
                    toggleActions: "play none none reverse",
                }
            }

        );
    });

    // TEXT RIGHT SLIDE IN

    var rightSlideIns = gsap.utils.toArray(".right-slide-in");

    rightSlideIns.forEach((rightSlideIn) => {

        gsap.fromTo(
            rightSlideIn,
            {
                autoAlpha: 0,
                x: 100
            },
            {
                autoAlpha: 1,
                x: 0,
                duration: 4,
                ease: "expo.out",
                scrollTrigger: {
                    trigger: rightSlideIn,
                    start: "top 75%",
                    end: "bottom 25%",
                    scrub: true,
                    toggleActions: "play none none reverse",
                }
            }

        );
    });

    // INTRO 

    gsap.from(".intro-window", {
        scrollTrigger: {
            trigger: "section.intro",
            scrub: true,
            start: "25% 75%",
            end: "75% 75%",
            toggleActions: "play none none reverse"
        },
        autoAlpha: 0,
        ease: "none",
        y: 100,
    });

    // CONCLUSION 

    gsap.from(".conclusion .content", {
        scrollTrigger: {
            trigger: "section.conclusion",
            scrub: true,
            start: "top 75%",
            end: "50% 50%",
            toggleActions: "play none none reverse"
        },
        autoAlpha: 0,
        ease: "none"
    });

    gsap.from(".conclusion", {
        scrollTrigger: {
            trigger: "section.conclusion",
            scrub: true,
            start: "top bottom",
            end: "top 25%",
        },
        autoAlpha: 0,
        ease: "none"
    });

    // WINDOWS SLIDE IN

    var chartWindows = gsap.utils.toArray(".chart-window");

    chartWindows.forEach((chartWindow) => {
        gsap.fromTo(
            chartWindow,
            {
                autoAlpha: 0,
                y: 100,
                webkitFilter: 'blur(8px)',
                filter: 'blur(8px)',
                rotationX: 20,
            },
            {
                autoAlpha: 1,
                y: 0,
                webkitFilter: 'blur(0px)',
                filter: 'blur(0px)',
                rotationX: 0,
                duration: 4,
                ease: "expo.out",
                scrollTrigger: {
                    trigger: chartWindow,
                    start: "top 75%",
                    end: "bottom 60%",
                    scrub: true,
                    toggleActions: "play none none reverse",
                }
            }

        );
    });

    var controllerWindows = gsap.utils.toArray(".controller-window");

    controllerWindows.forEach((controllerWindow) => {
        gsap.fromTo(
            controllerWindow,
            {
                autoAlpha: 0,
                X: 100,
                webkitFilter: 'blur(8px)',
                filter: 'blur(8px)',
                rotationY: -20,
            },
            {
                autoAlpha: 1,
                y: 0,
                webkitFilter: 'blur(0px)',
                filter: 'blur(0px)',
                rotationY: 0,
                duration: 4,
                ease: "expo.out",
                scrollTrigger: {
                    trigger: controllerWindow,
                    start: "top bottom",
                    end: "60% 60%",
                    scrub: true,
                    toggleActions: "play none none reverse",
                }
            }
        );
    });

    // HERO

    document.fonts.ready.then(() => {
        let split;

        let heroTl = gsap.timeline(
            {
                defaults: {
                    duration: 2,
                    ease: "power2.out",
                }
            }

        )

        const backElements = document.querySelectorAll(".stats-up,.stream-stats,.view-stats");
        const frontElements = document.querySelectorAll(".front, .flashes");

        heroTl.fromTo("header .gradient.wallpaper",
            {
                opacity: 0,
            },
            {
                opacity: 1,
                duration: 2,
            },
            1,
        );
        heroTl.fromTo("header .pattern.wallpaper",
            {
                opacity: 0,
            },
            {
                opacity: 0.1,
                duration: 2,
            },
            1,
        );
        heroTl.fromTo(frontElements,
            {
                opacity: 0,
            },
            {
                opacity: 1,
                duration: 2,
            },
            2,
        );
        heroTl.fromTo(".stats-wave",
            {
                opacity: 0,
                y: 100,
            },
            {
                opacity: 1,
                y: 0,
                duration: 2,
                ease: "power2.out",
            },
            2,
        );
        heroTl.fromTo(backElements,
            {
                opacity: 0,
            },
            {
                opacity: 1,
                duration: 2,
            },
            3,
        );
        // Démarrer les animations aléatoires juste après que les backElements apparaissent
        heroTl.call(() => {
            const animateRandom = () => {
                gsap.to(".stream-stats", {
                    duration: 3.5,
                    y: () => gsap.utils.random(-50, 50), // Utiliser une fonction pour une nouvelle valeur aléatoire à chaque cycle
                    ease: "sine.inOut",
                    onComplete: animateRandom
                });
                gsap.to(".view-stats", {
                    duration: 3.5,
                    y: () => gsap.utils.random(-50, 50),
                    ease: "sine.inOut",
                    onComplete: animateRandom
                });
                gsap.to(".flashes", {
                    duration: 2,
                    opacity: () => gsap.utils.random(0.6, 1),
                    filter: () => gsap.utils.random("blur(12px)", "blur(4px)"),
                    ease: "sine.inOut",
                    onComplete: animateRandom
                });
            };
            animateRandom();
        }, null, "<2");
        heroTl.fromTo("header .scroll-down",
            {
                autoAlpha: 0,
            },
            {
                autoAlpha: 1,
                duration: 2,
                ease: "expo.out",
            },
            4,
        );

        SplitText.create(".title-wrapper h1", {
            type: "words, lines",
            linesClass: "line",
            autoSplit: true,
            mask: "lines",
            onSplit: self => {
                split = gsap.from(self.lines, {
                    duration: 1.5,
                    yPercent: 100,
                    opacity: 0,
                    stagger: 0.1,
                    ease: "expo.out"
                });

                heroTl.add(split, 3.5);
                return split;
            }
        });
    });


    // Title hide
    gsap.to(".hero .title-wrapper", {
        scrollTrigger: {
            trigger: "header",
            start: "100% 40%",
            toggleActions: "play none none reverse",
        },
        autoAlpha: 0,
        ease: "none",
        duration: 0.01,
    });

    //NAV BAR

    gsap.fromTo(".menu", {
        autoAlpha: 0,
        y: 100,
    }, {
        autoAlpha: 1,
        y: 0,
        duration: 2,
        ease: "expo.out",
        scrollTrigger: {
            trigger: "main",
            start: "top 75%",
            toggleActions: "play none none none",
            once: true,
        },
    });

    // TRIVIA-CARDS

    var triviaCards = gsap.utils.toArray(".trivia-card");

    triviaCards.forEach((triviaCard) => {

        gsap.fromTo(
            triviaCard,
            {
                autoAlpha: 0,
                y: 100,
                scale: 1.1,
            },
            {
                autoAlpha: 1,
                y: 0,
                scale: 1,
                duration: 2,
                ease: "expo.out",
                scrollTrigger: {
                    trigger: triviaCard,
                    start: "top 75%",
                    end: "bottom 25%",
                    scrub: true,
                    toggleActions: "play none none reverse",
                }
            }

        );
        const scrambleNumber = triviaCard.querySelector(".scramble-number");
        if (scrambleNumber) {
            const originalText = scrambleNumber.textContent;

            let scrambleTl = gsap.timeline(
                {
                    scrollTrigger: {
                        trigger: triviaCard,
                        start: "top 75%",
                        toggleActions: "play none none none",
                        once: true,
                    },
                }
            );

            scrambleTl.fromTo(
                scrambleNumber,
                {
                    opacity: 0,
                    y: 100,
                    scrambleText: {
                        text: "",
                        chars: "0123456789",
                    },
                },
                {
                    duration: 4,
                    ease: "expo.out",
                    opacity: 1,
                    y: 0,
                    scrambleText: {
                        text: originalText,
                        chars: "0123456789",
                        speed: 0.5,
                        revealDelay: 0.5,
                    },
                },
            );
            scrambleTl.fromTo(
                triviaCard.querySelector(".scramble-text"),
                {
                    opacity: 0,
                    y: 100,
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: .8,
                    ease: "expo.out",
                },
                1,
            );
        }
    });

    // DESCRIPTION

    var descriptionSections = gsap.utils.toArray(".description");

    descriptionSections.forEach((descriptionSection) => {

        let descTl = gsap.timeline(
            {
                defaults: {
                    duration: 4,
                    ease: "expo.out",
                },
                scrollTrigger: {
                    trigger: descriptionSection,
                    start: "top 75%",
                    end: "bottom 25%",
                    toggleActions: "play none none reverse",
                    scrub: true,
                }
            }
        );

        descTl.fromTo(
            descriptionSection.querySelector("h2"),
            {
                autoAlpha: 0,
                y: 100,
            },
            {
                autoAlpha: 1,
                y: 0,
            }

        );
        descTl.fromTo(
            descriptionSection.querySelector(".description-content p:nth-child(1)"),
            {
                autoAlpha: 0,
                y: 100,
            },
            {
                autoAlpha: 1,
                y: 0,
            },
            1,
        );
        descTl.fromTo(
            descriptionSection.querySelector(".description-content p:nth-child(2)"),
            {
                autoAlpha: 0,
                y: 100,
            },
            {
                autoAlpha: 1,
                y: 0,
            },
            1.5,
        );
    });




    ScrollTrigger.refresh();
});