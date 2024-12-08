import React, { Component, createRef } from 'react';
import {
    View,
    FlatList,
    Text,
    ListRenderItemInfo,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DraxProvider, DraxList, DraxViewDragStatus } from 'react-native-drax';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

interface Item {
    id: number;
    name: string;
}

interface MatchComponentProps {
    fixedItems: string[];
    draggableItems: Item[];
    onSubmit: (reorderedItems: Item[]) => void;
    showCorrectAnswer: boolean;
    questionList: Array<any>;
    currentQuestionIndex: number;
    clairVoyanceUsed: boolean;
    clairVoyageDone: () => void;
    isLoading: boolean;
}

interface MatchComponentState {
    draggableData: Item[];
    results: boolean[];
    loading: boolean; // Add loading state
}

class MatchComponent extends Component<MatchComponentProps, MatchComponentState> {
    private listRef = createRef<FlatList<Item>>();

    constructor(props: MatchComponentProps) {
        super(props);
        this.state = {
            draggableData: this.jumbleArray(props.draggableItems),
            results: new Array(props.fixedItems.length).fill(false),
            loading: false, // Initialize loading as false
        };
        console.log('reset');
    }

    jumbleArray(array: Item[]): Item[] {
        return array.sort(() => Math.random() - 0.5);
    }

    handleItemReorder = ({ fromIndex, toIndex }: { fromIndex: number; toIndex: number }) => {
        const newData = [...this.state.draggableData];
        newData.splice(toIndex, 0, newData.splice(fromIndex, 1)[0]);
        this.setState({ draggableData: newData });

        if (this.props.clairVoyanceUsed) {
            this.props.clairVoyageDone();
        }
    };

    handleSubmit = () => {
        this.setState({ loading: true });

        const { draggableData } = this.state;
        const { questionList, currentQuestionIndex } = this.props;
        const currentQuestion = questionList[currentQuestionIndex];

        const newResults = draggableData.map((item, index) =>
            currentQuestion[`match${index + 1}`] === item.id
        );
        this.setState({ results: newResults });

        this.props.onSubmit(draggableData);
    };

    checkAnswer = () => {
        const { draggableData } = this.state;
        const { questionList, currentQuestionIndex } = this.props;
        const currentQuestion = questionList[currentQuestionIndex];

        const newResults = draggableData.map((item, index) =>
            currentQuestion[`match${index + 1}`] === item.id
        );

        this.setState({ results: newResults });
    };

    componentDidUpdate(prevProps: MatchComponentProps) {
        if (this.props.clairVoyanceUsed && !prevProps.clairVoyanceUsed) {
            this.checkAnswer();
        }
    }

    render() {
        const { fixedItems, showCorrectAnswer } = this.props;
        const { draggableData, results, loading } = this.state;

        return (
            <GestureHandlerRootView className="flex-1">
                <DraxProvider>
                    <SafeAreaView className="flex-1">
                        <View className="flex-1 justify-center items-center">
                            <View className="flex-1 mb-2 flex-row">
                                <View className="w-[50%] pr-2">
                                    <FlatList
                                        data={fixedItems}
                                        renderItem={({ item, index }: ListRenderItemInfo<string>) => (
                                            <View className="flex-row items-center my-1">
                                                {showCorrectAnswer && (
                                                    <Text className="text-white mr-2">
                                                        {results[index] ? '✔️' : '❌'}
                                                    </Text>
                                                )}
                                                <View className="p-3 bg-transparent rounded-lg border border-white items-center flex-1">
                                                    <Text className="text-white text-center text-justify">
                                                        {item}
                                                    </Text>
                                                </View>
                                            </View>
                                        )}
                                        keyExtractor={(item) => item}
                                    />
                                </View>

                                <View className="pl-2 w-[50%]">
                                    <DraxList
                                        ref={this.listRef}
                                        data={draggableData}
                                        renderItemContent={({ item }, { viewState }) => (
                                            <View
                                                className={`p-3 bg-white rounded-lg my-1 border items-center ${viewState?.dragStatus === DraxViewDragStatus.Dragging
                                                    ? 'border border-black'
                                                    : 'border border-white'
                                                    }`}
                                            >
                                                <Text className="text-black text-center text-justify">
                                                    {item.name}
                                                </Text>
                                            </View>
                                        )}
                                        onItemReorder={this.handleItemReorder}
                                        keyExtractor={(item) => item.id.toString()}
                                    />
                                </View>
                            </View>
                            <TouchableOpacity
                                onPress={this.handleSubmit}
                                disabled={loading} // Disable button based on loading state
                            >
                                <View className="w-[40%] mb-12 px-6 py-2 bg-white rounded-xl">
                                    <Text className={`text-base text-center font-bold ${loading ? 'text-gray-500' : 'text-[#000000]'}`}>
                                        {'Submit'}
                                    </Text>

                                </View>
                            </TouchableOpacity>
                        </View>
                    </SafeAreaView>
                </DraxProvider>
            </GestureHandlerRootView>
        );
    }
}

export default MatchComponent;
