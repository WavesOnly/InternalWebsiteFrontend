export const openExternalLink = (link, newTab = true) => {
    window.open(link, newTab ? "_blank" : "_self");
};