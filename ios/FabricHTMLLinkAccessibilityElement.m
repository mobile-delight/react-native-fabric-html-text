#import "FabricHTMLLinkAccessibilityElement.h"

@implementation FabricHTMLLinkAccessibilityElement

- (instancetype)initWithAccessibilityContainer:(id)container
                                     linkIndex:(NSUInteger)linkIndex
                                totalLinkCount:(NSUInteger)totalLinkCount
                                           url:(NSURL *)url
                                   contentType:(HTMLDetectedContentType)contentType
                                      linkText:(NSString *)linkText
                                         frame:(CGRect)frame
{
    self = [super initWithAccessibilityContainer:container];
    if (self) {
        _linkIndex = linkIndex;
        _totalLinkCount = totalLinkCount;
        _url = [url copy];
        _contentType = contentType;
        _linkText = [linkText copy];

        // Set the accessibility frame
        self.accessibilityFrame = frame;

        // Configure accessibility properties
        [self configureAccessibilityProperties];
    }
    return self;
}

- (void)configureAccessibilityProperties
{
    // Set traits to indicate this is a link
    self.accessibilityTraits = UIAccessibilityTraitLink;

    // Build accessibility label with link text and position
    // Format: "Link text, link X of Y"
    NSString *positionInfo = [NSString stringWithFormat:@"link %lu of %lu",
                              (unsigned long)(self.linkIndex + 1),
                              (unsigned long)self.totalLinkCount];

    if (self.linkText.length > 0) {
        self.accessibilityLabel = [NSString stringWithFormat:@"%@, %@",
                                   self.linkText, positionInfo];
    } else {
        // Fallback if no link text
        self.accessibilityLabel = positionInfo;
    }

    // Set accessibility hint based on content type
    self.accessibilityHint = [self hintForContentType];
}

- (NSString *)hintForContentType
{
    switch (self.contentType) {
        case HTMLDetectedContentTypeEmail:
            return @"Double tap to compose email";
        case HTMLDetectedContentTypePhone:
            return @"Double tap to call";
        case HTMLDetectedContentTypeLink:
        default:
            return @"Double tap to open link";
    }
}

#pragma mark - UIAccessibilityAction

- (BOOL)accessibilityActivate
{
    // Get the parent view to trigger the link activation
    id container = self.accessibilityContainer;
    if ([container isKindOfClass:[FabricHTMLCoreTextView class]]) {
        FabricHTMLCoreTextView *coreTextView = (FabricHTMLCoreTextView *)container;

        // Check if delegate responds to link tap
        if ([coreTextView.delegate respondsToSelector:@selector(coreTextView:didTapLinkWithURL:type:)]) {
            [coreTextView.delegate coreTextView:coreTextView
                              didTapLinkWithURL:self.url
                                           type:self.contentType];
        }
        // Return YES to indicate this element is activatable, even if no delegate is set
        // This tells VoiceOver that the element can be activated
        return YES;
    }
    return NO;
}

@end
